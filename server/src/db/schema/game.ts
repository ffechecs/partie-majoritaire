import { text, int, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { TableUser } from "./auth";

export const TableGames = sqliteTable("games", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  name: text("name").notNull(),
  createdAt: text("created_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
  settings: text("settings", { mode: "json" })
    .$type<{
      challengerColor: "black" | "white";
      challengerTime: number;
      majorityTime: number;
      isGameForSchools: boolean;
      liveStreamUrl?: string;
    }>()
    .notNull(),
  challengerCode: text("challenger_code").notNull(),
  majorityCode: text("majority_code").notNull(),
  createdBy: text("created_by", { length: 36 }).notNull(),
});

export const TablePlayers = sqliteTable("players", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  name: text("name").notNull(),
  createdAt: text("created_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
  userId: text("user_id", { length: 36 })
    .notNull()
    .references(() => TableUser.id),
});

export const TablePlayersConnections = sqliteTable("players_connections", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  playerId: text("player_id", { length: 36 }).notNull(),
  connected: integer("connected", { mode: "boolean" }).default(false).notNull(),
  createdAt: text("created_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
  gameId: text("game_id", { length: 36 }).notNull(),
});

export const TableMoves = sqliteTable("moves", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  gameId: text("game_id", { length: 36 }).notNull(),
  playerId: text("player_id", { length: 36 }),
  moveSan: text("move_san").notNull(),
  fen: text("fen").notNull(),
  moveNumber: int("move_number").notNull(),
  color: text("color", { enum: ["white", "black"] }).notNull(),
  createdAt: text("created_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
  startSquare: text("start_square").notNull(),
  endSquare: text("end_square").notNull(),
});

export const TableVotes = sqliteTable("votes", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  gameId: text("game_id", { length: 36 }).notNull(),
  moveSan: text("move_san").notNull(),
  fen: text("fen").notNull(),
  moveNumber: int("move_number").notNull(),
  playerId: text("player_id", { length: 36 }).notNull(),
  color: text("color", { enum: ["white", "black"] }).notNull(),
  createdAt: text("created_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
  startSquare: text("start_square").notNull(),
  endSquare: text("end_square").notNull(),
});

export const playersRelation = relations(TablePlayers, ({ one, many }) => ({
  votes: many(TableVotes),
  playersConnections: many(TablePlayersConnections),
}));

export const playersConnectionsRelation = relations(
  TablePlayersConnections,
  ({ one, many }) => ({
    player: one(TablePlayers, {
      fields: [TablePlayersConnections.playerId],
      references: [TablePlayers.id],
    }),
    game: one(TableGames, {
      fields: [TablePlayersConnections.gameId],
      references: [TableGames.id],
    }),
  })
);

export const gamesRelation = relations(TableGames, ({ one, many }) => ({
  moves: many(TableMoves),
  votes: many(TableVotes),
  playersConnections: many(TablePlayersConnections),
  createdBy: one(TableUser, {
    fields: [TableGames.createdBy],
    references: [TableUser.id],
  }),
}));

export const movesRelation = relations(TableMoves, ({ one, many }) => ({
  game: one(TableGames, {
    fields: [TableMoves.gameId],
    references: [TableGames.id],
  }),
}));

export const votesRelation = relations(TableVotes, ({ one, many }) => ({
  player: one(TablePlayers, {
    fields: [TableVotes.playerId],
    references: [TablePlayers.id],
  }),
  game: one(TableGames, {
    fields: [TableVotes.gameId],
    references: [TableGames.id],
  }),
}));

export type PlayerInsert = typeof TablePlayers.$inferInsert;
export type PlayerConnectionInsert =
  typeof TablePlayersConnections.$inferInsert;
export type GameInsert = typeof TableGames.$inferInsert;
export type MoveInsert = typeof TableMoves.$inferInsert;
export type VoteInsert = typeof TableVotes.$inferInsert;

export type Player = typeof TablePlayers.$inferSelect;
export type PlayerConnection = typeof TablePlayersConnections.$inferSelect;
export type Game = typeof TableGames.$inferSelect;
export type Move = typeof TableMoves.$inferSelect;
export type Vote = typeof TableVotes.$inferSelect;
