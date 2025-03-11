import { eq, desc, asc } from "drizzle-orm";
import { db } from "../../db/db";
import { MoveInsert, TableMoves } from "../../db/schema/game";

export async function addMove(move: Omit<MoveInsert, "id">) {
  console.log("ADDING MOVE AT ", new Date().toString());
  const uuid = crypto.randomUUID();

  const data = await db.transaction(async (tx) => {
    await tx.insert(TableMoves).values({
      ...move,
      id: uuid,
    });
    const data = await tx.query.TableMoves.findFirst({
      where: eq(TableMoves.id, uuid),
    });
    return data;
  });
  if (!data) {
    throw new Error("Move not found");
  }

  return data;
}

export async function getLastGameMove(gameId: string) {
  return await db.query.TableMoves.findFirst({
    where: eq(TableMoves.gameId, gameId),
    orderBy: desc(TableMoves.moveNumber),
  });
}
export async function getMoves(gameId: string) {
  return await db.query.TableMoves.findMany({
    where: eq(TableMoves.gameId, gameId),
    orderBy: asc(TableMoves.moveNumber),
  });
}
