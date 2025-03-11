import { eq } from "drizzle-orm";
import { db } from "../../db/db";
import { TableUser, UserInsert } from "../../db/schema/auth";

export function getUsers() {
  return db.select().from(TableUser);
}

export function getUser(id: string) {
  return db.select().from(TableUser).where(eq(TableUser.id, id));
}

type MakeAllFieldsOptional<T> = {
  [P in keyof T]?: T[P];
};

export function editUser(
  id: string,
  body: MakeAllFieldsOptional<
    Omit<UserInsert, "id" | "createdAt" | "email" | "emailVerified">
  >
) {
  return db.update(TableUser).set(body).where(eq(TableUser.id, id));
}
