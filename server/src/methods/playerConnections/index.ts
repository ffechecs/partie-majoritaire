import { and, eq } from "drizzle-orm";
import { db } from "../../db/db";
import { TablePlayersConnections, TablePlayers } from "../../db/schema/game";

export async function getConnectedPlayers(gameId: string) {
  const data_pre = await db
    .select()
    .from(TablePlayersConnections)
    .where(
      and(
        eq(TablePlayersConnections.gameId, gameId),
        eq(TablePlayersConnections.connected, true)
      )
    )
    .leftJoin(
      TablePlayers,
      eq(TablePlayersConnections.playerId, TablePlayers.id)
    );
  const filtered = data_pre
    .map((c) => c.players)
    .flat()
    .filter(Boolean);
  return filtered;
  // const data = await db.query.playersConnections.findMany({
  //   columns: {},
  //   with: {
  //     player: true,
  //   },
  // })
  // console.log("getConnectedPlayers", data)
  // return data.map((c) => c.player)
}

export async function setPlayerConnected(playerId: string, gameId: string) {
  const uuid = crypto.randomUUID();

  await db.insert(TablePlayersConnections).values({
    id: uuid,
    playerId: playerId,
    connected: true,
    gameId,
  });
}

export async function setPlayerDisconnected(schoolId: string, gameId: string) {
  await db
    .update(TablePlayersConnections)
    .set({
      connected: false,
    })
    .where(
      and(
        eq(TablePlayersConnections.playerId, schoolId),
        eq(TablePlayersConnections.gameId, gameId)
      )
    );
}
