import { Elysia, t } from "elysia";
// import { cors } from "./cors";
import { cors } from "@elysiajs/cors";
import {
  addMove,
  addVote,
  getConnectedPlayers,
  getGame,
  getGameVotes,
  getGameVotesForMoveNumber,
  getLastGameMove,
  getMoves,
  getPlayer,
  setPlayerConnected,
  setPlayerDisconnected,
} from "./methods";
import { wsBodySchema, wsResponseSchema } from "./ws/schema";

import { cron } from "@elysiajs/cron";
import { runCron } from "./cron";
import { client, db } from "./db/db";
import { normalRoutes } from "./routes";
import { authRoutes } from "./authRoutes";

export type WS = Parameters<
  NonNullable<Parameters<(typeof app)["ws"]>["1"]["message"]>
>["0"];

// key is auto generated id given by elysia
export const clients: Record<
  string,
  { playerId: string | undefined; gameId: string; ws: WS }
> = {};

export function prettyPrintDuration(duration: number) {
  if (duration >= 1000) {
    return (duration / 1000).toFixed(0) + "ms";
  } else {
    return duration.toFixed(0) + "us";
  }
}

// import { appendFileSync } from "fs";
import { logger } from "./logger";
import { TablePlayersConnections } from "./db/schema/game";
import { eq } from "drizzle-orm";

async function isConnectionCorrect(
  playerId: string | undefined,
  gameId: string
) {
  const game = await getGame(gameId);
  if (game == undefined) {
    return false;
  }
  if (playerId == undefined) {
    return true; // true because champion does not have playerId
  }
  const player = await getPlayer(playerId);
  if (player == undefined) {
    console.log("isConnectionCorrect: player does not exist", playerId);
    return false;
  }
  return true;
}

const app = new Elysia({ prefix: "/api", websocket: { publishToSelf: true }, name: "server" })
  // .use(Logestic.preset("fancy"))
  .use(logger)
  .use(
    cron({
      name: "server sync",
      pattern: "*/5 * * * * *",
      async run() {
        if (!process.env.SYNC_URL) return;
        const start = Bun.nanoseconds();
        await client.sync();
        const delta = (Bun.nanoseconds() - start) / 1000;
        console.log(
          `took ${prettyPrintDuration(delta)} to run cron server sync`
        );
      },
    })
  )
  .use(
    cron({
      name: "heartbeat",
      pattern: "*/2 * * * * *",
      async run() {
        const start = Bun.nanoseconds();
        // console.log("runCron");
        await runCron(clients);
        const delta = (Bun.nanoseconds() - start) / 1000;
        // console.log(`took ${prettyPrintDuration(delta)} to run cron heartbeat`);
      },
    })
  )
  .use(cors())
  .use(normalRoutes)
  .use(authRoutes)
  // .onBeforeHandle(({ request }) => {
  //   console.log("onBeforeHandle", request.url);
  // })
  .onAfterHandle(({ set }) => {
    // add content-type header
    set.headers["content-type"] = "application/json";
  })
  .get("/clients", () => {
    const returnValue: {
      id: string;
      playerId: string | undefined;
      gameId: string;
    }[] = [];
    for (const c of Object.values(clients)) {
      returnValue.push({
        id: c.ws.id,
        playerId: c.playerId,
        gameId: c.gameId,
      });
    }
    return returnValue;
  })
  .get("/current-connections", async () => {
    const returnValue = await db
      .select()
      .from(TablePlayersConnections)
      .where(eq(TablePlayersConnections.connected, true));
    return returnValue;
  })
  .get("/force-refresh", async () => {
    try {
      for (const c of Object.values(clients)) {
        c.ws.send({ type: "refresh" });
      }
      return { status: "ok", clientsNb: Object.keys(clients).length };
    } catch (e) {
      console.log("error", e);
      return { status: "error", clientsNb: Object.keys(clients).length };
    }
  })
  .get("/run-cron", async () => {
    try {
      await runCron(clients);
      return { status: "ok", clientsNb: Object.keys(clients).length };
    } catch (e) {
      console.log("error", e);
      return { status: "error", clientsNb: Object.keys(clients).length };
    }
  })
  .ws("/ws", {
    query: t.Object({
      gameId: t.String(),
      playerId: t.String(),
    }),
    body: wsBodySchema,
    response: wsResponseSchema,
    async open(ws) {
      console.log("open", ws.id);
      const playerId =
        ws.data.query.playerId == "undefined"
          ? undefined
          : ws.data.query.playerId;
      const gameId = ws.data.query.gameId;

      if (playerId) {
        // if player id is already in clients, disconnect him
        const allConnectedPlayers = Object.values(clients)
          .map((c) => c.playerId)
          .filter((v) => v != undefined);

        // if (process.env.NODE_ENV != "production") {
        //   const data = Object.entries(clients).map(([id, c]) => ({
        //     id,
        //     playerId: c.playerId == undefined ? null : c.playerId,
        //     gameId: c.gameId,
        //   }));
        //   appendFileSync("ws-open.log", JSON.stringify(data, null, 2) + "\n");
        // }
        console.log("DOIING EXISTNECE CHECK", playerId, allConnectedPlayers);
        if (allConnectedPlayers.includes(playerId)) {
          ws.close();
        }
      }

      clients[ws.id] = { ws, playerId, gameId } as {
        ws: WS;
        playerId: string | undefined;
        gameId: string;
      };

      if (!(await isConnectionCorrect(playerId, gameId))) {
        ws.close();
        return;
      }
      ws.subscribe(gameId);

      // connect school
      if (playerId) {
        await setPlayerConnected(playerId, gameId);
        // get school informations
        const player = await getPlayer(playerId);
        if (player == undefined) {
          console.log("player is undefined", playerId, gameId);
          return;
        }
        // send new connected school to other
        ws.publish(gameId, {
          type: "playerConnect",
          player: { ...player, createdAt: player.createdAt.toString() },
        });
      }
      const game = await getGame(gameId);
      if (game == undefined) {
        console.log("game is undefined", playerId, gameId);
        return;
      }
      const connectedPlayers = await getConnectedPlayers(gameId);
      console.log("connectedPlayers", connectedPlayers.length);
      const lastMove = await getLastGameMove(gameId);
      const allMoves = await getMoves(gameId);
      const currentVotes =
        lastMove == undefined
          ? await getGameVotesForMoveNumber(gameId, 0)
          : await getGameVotesForMoveNumber(gameId, lastMove.moveNumber + 1);

      const allUserVotes = await getGameVotes(gameId);

      const lastUserVote = currentVotes.find(
        (v) => v.playerId == playerId && v.gameId == gameId
      );

      ws.send({
        type: "connect",
        data: {
          game: {
            ...game,
            createdAt: game.createdAt.toString(),
          },
          players: connectedPlayers.map((p) => ({
            ...p,
            createdAt: p!.createdAt.toString(),
          })),
          moves: allMoves.map((m) => ({
            ...m,
            createdAt: m.createdAt.toString(),
          })),
          votes: currentVotes.map((v) => ({
            ...v,
            createdAt: v.createdAt.toString(),
          })),
          lastUserVote: lastUserVote == undefined ? null : lastUserVote,
          lastMove:
            lastMove == undefined
              ? null
              : {
                  ...lastMove,
                  createdAt: lastMove.createdAt.toString(),
                },
          hasUserVoted: currentVotes.some(
            (v) => v.playerId == playerId && v.gameId == gameId
          ),
          allUserVotes: allUserVotes.filter(
            (v) => v.playerId == playerId && v.gameId == gameId
          ),
        },
      });
    },
    async close(ws) {
      console.log("close", ws.id);
      console.log("is before", ws.id in clients);
      delete clients[ws.id];
      console.log("is after", ws.id in clients);
      const playerId =
        ws.data.query.playerId == "undefined"
          ? undefined
          : ws.data.query.playerId;

      const gameId = ws.data.query.gameId;
      console.log("close", playerId, gameId, typeof playerId);
      if (playerId) {
        // disconnect school
        await setPlayerDisconnected(playerId, gameId);
        // get school informations
        const player = await getPlayer(playerId);
        if (!player) {
          console.log("player is undefined", playerId, gameId);
          return;
        }
        // send new connected school to other
        ws.publish(gameId, { type: "playerDisconnect", playerId: player.id });
      }
      ws.unsubscribe(gameId);
    },
    drain(ws) {
      console.log("drain");
    },
    async message(ws, message) {
      // @ts-ignore
      if (message.data) {
        // @ts-ignore
        console.log("message", message.type, message.data);
      } else {
        console.log("message", message.type);
      }
      const playerId =
        ws.data.query.playerId == "undefined"
          ? undefined
          : ws.data.query.playerId;
      const gameId = ws.data.query.gameId;
      if (message.type == "vote") {
        if (playerId == undefined) {
          console.log("playerId is undefined");
          return;
        }
        const data = message.data;
        const insertedVote = await addVote({
          gameId: gameId,
          moveNumber: data.moveNumber,
          playerId,
          color: data.color,
          fen: data.fen,
          moveSan: data.moveSan,
          startSquare: data.startSquare,
          endSquare: data.endSquare,
        });

        ws.publish(gameId, {
          type: "vote",
          vote: {
            ...insertedVote,
            createdAt: insertedVote.createdAt.toString(),
          },
        });
      } else if (message.type == "move") {
        const data = message.data;
        console.log("received move", data);
        const insertedMove = await addMove({
          gameId: gameId,
          moveSan: data.moveSan,
          fen: data.fen,
          playerId,
          moveNumber: data.moveNumber,
          color: data.color,
          startSquare: data.startSquare,
          endSquare: data.endSquare,
        });

        ws.publish(gameId, {
          type: "move",
          move: {
            ...insertedMove,
            createdAt: insertedMove.createdAt.toString(),
          },
        });
      } else if (message.type == "endVote") {
        await handleEndVoteManual(gameId, ws as WS);
      }
    },
  })
  .listen(3001, (server) => {
    console.log(`♟ Server is running at ${server?.hostname}:${server?.port}`);
  });

async function handleEndVoteManual(gameId: string, ws: WS) {
  console.log("endVote");
  const lastGameMove = await getLastGameMove(gameId);
  console.log("lastGameMove", lastGameMove);
  const gameVotes = await getGameVotesForMoveNumber(
    gameId,
    lastGameMove?.moveNumber !== undefined ? lastGameMove.moveNumber + 1 : 0
  );
  console.log("gameVotes", gameVotes);
  if (gameVotes.length == 0) {
    return;
  }

  const gameVotesCount = gameVotes.reduce((acc, vote) => {
    acc[vote.moveSan] = (acc[vote.moveSan] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const maxVote = Object.entries(gameVotesCount).reduce(
    (acc, [moveSan, count]) => {
      if (count > acc.count) {
        return { moveSan, count };
      }
      return acc;
    },
    { moveSan: "", count: 0 }
  );
  const maxVotedMove = gameVotes.find(
    (vote) => vote.moveSan == maxVote.moveSan
  );
  if (!maxVotedMove) {
    console.log("maxVotedMove is undefined");
    return;
  }

  console.log("maxVote", maxVote);
  const insertedMove = await addMove({
    gameId: gameId,
    moveSan: maxVote.moveSan,
    fen: maxVotedMove.fen,
    moveNumber: maxVotedMove.moveNumber,
    color: "black",
    startSquare: maxVotedMove.startSquare,
    endSquare: maxVotedMove.endSquare,
  });
  ws.publish(gameId, {
    type: "move",
    move: {
      ...insertedMove,
      createdAt: insertedMove.createdAt.toString(),
    },
  });
}

export type App = typeof app;
