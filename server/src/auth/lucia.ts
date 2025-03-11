import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "../db/db";
import { UserInfo, SessionTable, TableUser } from "../db/schema/auth";
import { Lucia, User } from "lucia";

export const adapter = new DrizzleSQLiteAdapter(db, SessionTable, TableUser);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      emailVerified: attributes.emailVerified,
      email: attributes.email,
      role: attributes.role,
      userInfo: attributes.userInfo,
    };
  },
});

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      email: string;
      emailVerified: number;
      role: "user" | "admin" | "superadmin";
      userInfo: UserInfo;
    };
  }
}

export type LuciaUser = User;
