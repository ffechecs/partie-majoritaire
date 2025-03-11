import { PlayerInsert, TablePlayers } from "../../db/schema/game";
import { db } from "../../db/db";
import { eq } from "drizzle-orm";

export async function addPlayer(player: Omit<PlayerInsert, "id">) {
  const uuid = crypto.randomUUID();
  const data = await db.insert(TablePlayers).values({
    ...player,
    id: uuid,
  });
  return await db.query.TablePlayers.findFirst({
    where: eq(TablePlayers.id, uuid),
  });
}

export async function findPlayerWithUserId(userId: string) {
  return await db.query.TablePlayers.findFirst({
    where: eq(TablePlayers.userId, userId),
  });
}

export async function getPlayers() {
  const data = await db.query.TablePlayers.findMany();
  return data;
}

export async function getPlayer(playerId: string) {
  const data = await db.query.TablePlayers.findFirst({
    where: eq(TablePlayers.id, playerId),
  });
  return data;
}
