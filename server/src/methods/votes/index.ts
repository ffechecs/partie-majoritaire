import { and, eq } from "drizzle-orm";
import { db } from "../../db/db";
import { VoteInsert, TableVotes } from "../../db/schema/game";

export async function addVote(vote: Omit<VoteInsert, "id">) {
  const uuid = crypto.randomUUID();
  await db.insert(TableVotes).values({
    ...vote,
    id: uuid,
  });
  const data = await db.query.TableVotes.findFirst({
    where: eq(TableVotes.id, uuid),
  });
  if (!data) {
    throw new Error("Vote not found");
  }
  return data;
}

export async function getGameVotesForMoveNumber(
  gameId: string,
  moveNumber: number
) {
  const currentVotes = await db
    .select()
    .from(TableVotes)
    .where(
      and(eq(TableVotes.gameId, gameId), eq(TableVotes.moveNumber, moveNumber))
    );
  return currentVotes;
}
export async function getGameVotes(gameId: string) {
  const currentVotes = await db
    .select()
    .from(TableVotes)
    .where(eq(TableVotes.gameId, gameId));
  return currentVotes;
}
