import { createId } from "@paralleldrive/cuid2";
import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { Static, t } from "elysia";

export const userInfoSchema = t.Union([
  t.Object({
    username: t.String(),
    isSchool: t.Literal(false),
  }),
  t.Object({
    username: t.String(),
    isSchool: t.Literal(true),
    schoolName: t.String(),
    schoolUAICode: t.Optional(t.String()),
    schoolZipCode: t.Optional(t.String()),
  }),
]);

export type UserInfo = Static<typeof userInfoSchema>;

export const TableUser = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  email: text("email").notNull(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  role: text("role")
    .default("user")
    .notNull()
    .$type<"user" | "admin" | "superadmin">(),
  createdAt: text("created_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
  userInfo: text("user_info", { mode: "json" }).$type<UserInfo>().notNull(),
});

export const SessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id", { length: 36 })
    .notNull()
    .references(() => TableUser.id),
  expiresAt: integer("expires_at").notNull(),
});

export const TableEmailVerificationCode = sqliteTable(
  "email_verification_code",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .notNull()
      .primaryKey(),
    userId: text("user_id"),
    email: text("email").notNull(),
    code: text("code").notNull(),
    expiresAt: text("expires_at").notNull(),
  }
);

export type User = typeof TableUser.$inferSelect;
export type EmailVerificationCode =
  typeof TableEmailVerificationCode.$inferSelect;
export type Session = typeof SessionTable.$inferSelect;

export type UserInsert = typeof TableUser.$inferInsert;
export type EmailVerificationCodeInsert =
  typeof TableEmailVerificationCode.$inferInsert;
export type SessionInsert = typeof SessionTable.$inferInsert;
