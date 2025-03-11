import { desc, eq, or } from "drizzle-orm";
import { db } from "../../db/db";
import {
  Game,
  GameInsert,
  TableGames,
  gamesRelation,
} from "../../db/schema/game";
import { getUserData } from "../../auth/code";
import { User } from "lucia";
import { TableUser } from "../../db/schema/auth";

// generate a 6 character code with uppercase letters and numbers
// exclude letters that look like numbers
function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function addGame(
  game: Omit<GameInsert, "id" | "majorityCode" | "challengerCode">,
) {
  const uuid = crypto.randomUUID();

  const majorityCode = generateCode();
  const challengerCode = generateCode();

  await db.insert(TableGames).values({
    ...game,
    id: uuid,
    majorityCode,
    challengerCode,
  });
  const data = await db.query.TableGames.findFirst({
    where: eq(TableGames.id, uuid),
  });
  if (!data) {
    throw new Error("Game not found");
  }
  return data;
}

export async function editGame(
  game: Omit<
    Game,
    "majorityCode" | "challengerCode" | "createdBy" | "createdAt"
  >,
) {
  const gameId = game.id!;

  await db.update(TableGames).set(game).where(eq(TableGames.id, gameId));

  return game;
}

export async function getGames() {
  const returnValue = await db
    .select()
    .from(TableGames)
    .innerJoin(TableUser, eq(TableGames.createdBy, TableUser.id))
    .orderBy(desc(TableGames.createdAt));
  return returnValue;
}

export async function getRawGames() {
  const returnValue = await db
    .select()
    .from(TableGames)
    .orderBy(desc(TableGames.createdAt));
  return returnValue;
}

export async function getGamesVisibleInAdmin(user: User) {
  if (user.role == "user") {
    return [];
  }
  if (user.role == "superadmin") {
    const games = await getGames();
    return games;
  }

  const games = await db
    .select()
    .from(TableGames)
    .innerJoin(TableUser, eq(TableGames.createdBy, TableUser.id))
    .where(eq(TableGames.createdBy, user.id))
    .orderBy(desc(TableGames.createdAt));
  return games;
}

export async function getGame(gameId: string) {
  return await db.query.TableGames.findFirst({
    where: eq(TableGames.id, gameId),
  });
}

export async function getGameFull(gameId: string) {
  const game = await db.query.TableGames.findFirst({
    where: eq(TableGames.id, gameId),
    with: { moves: true, votes: true },
  });
  if (!game) {
    throw new Error("Game not found");
  }
  return game;
}

export async function getGameByCode(code: string) {
  return await db.query.TableGames.findFirst({
    where: or(
      eq(TableGames.majorityCode, code),
      eq(TableGames.challengerCode, code),
    ),
  });
}

export async function deleteGame(gameId: string) {
  await db.delete(TableGames).where(eq(TableGames.id, gameId));
}
