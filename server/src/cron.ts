import {
  addMove,
  getGameVotesForMoveNumber,
  getGames,
  getLastGameMove,
  getRawGames,
} from "./methods";
import { Chess } from "chess.js";
import type { WS } from ".";
import { Game, Move } from "./db/schema/game";

type Clients = Record<string, { gameId: string; ws: WS }>;

async function handleEndVote(game: Game, ws: WS) {
  const gameId = game.id;
  console.log("endVote");
  const lastGameMove = await getLastGameMove(gameId);
  console.log("lastGameMove", lastGameMove);
  const gameVotes = await getGameVotesForMoveNumber(
    gameId,
    lastGameMove?.moveNumber !== undefined ? lastGameMove.moveNumber + 1 : 0
  );
  console.log("gameVotes", gameVotes);
  if (gameVotes.length == 0) {
    console.log("no votes");
    console.log("sending winner", game.settings.challengerColor);
    ws.publish(gameId, {
      type: "gameOver",
      winner: game.settings.challengerColor,
    });
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
    color: game.settings.challengerColor == "white" ? "black" : "white",
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

async function timeOverMajority(clients: Clients, game: Game, lastMove: Move) {
  const clientWithSameGame = Object.values(clients).find(
    (client) => client.gameId == game.id
  );
  if (!clientWithSameGame) return;
  // if last move is from less than 10 sec return

  const endTime =
    new Date(lastMove.createdAt).getTime() + game.settings.majorityTime * 1000;
  const nowTime = new Date().getTime();

  if (endTime > nowTime) {
    // console.log(
    //   "lastMove",
    //   lastMove.color,
    //   lastMove?.gameId,
    //   `will be over in ${endTime - nowTime} ms`
    // );
    return;
  }
  console.log(
    "lastMove",
    lastMove.color,
    lastMove?.gameId,
    `is older than 10 sec`
  );

  console.log("handleEndVote");

  await handleEndVote(game, clientWithSameGame.ws);
}

async function timeOverChallenger(
  clients: Clients,
  game: Game,
  lastMove: Move
) {
  const clientWithSameGame = Object.values(clients).find(
    (client) => client.gameId == game.id
  );
  if (!clientWithSameGame) return;

  // if last move is from less than 10 sec return
  const endTime =
    new Date(lastMove.createdAt).getTime() +
    game.settings.challengerTime * 1000;
  const nowTime = new Date().getTime();

  if (endTime > nowTime) {
    // console.log("game", game.id, `will be over in ${endTime - nowTime} ms`);
    return;
  }

  console.log(
    "sending winner",
    game.settings.challengerColor == "white" ? "black" : "white"
  );

  clientWithSameGame.ws.publish(game.id, {
    type: "gameOver",
    winner: game.settings.challengerColor == "white" ? "black" : "white",
  });
}

let running = false;

export async function runCron(clients: Clients) {
  if (running) {
    console.log("cron already running");
    return;
  }
  if (Object.keys(clients).length == 0) return;
  running = true;
  try {
    const games = await getRawGames();
    games.forEach(async (game) => {
      const clientWithSameGame = Object.values(clients).find(
        (client) => client.gameId == game.id
      );
      if (!clientWithSameGame) return;
      const lastMove = await getLastGameMove(game.id);
      if (!lastMove) return;

      const chess = new Chess(lastMove.fen);

      if (lastMove.color == game.settings.challengerColor) {
        await timeOverMajority(clients, game, lastMove);
      } else {
        await timeOverChallenger(clients, game, lastMove);
      }
    });
  } catch (e) {
    console.log(e);
  }
  running = false;
}
