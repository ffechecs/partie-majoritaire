import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import { eq } from "drizzle-orm";

async function generateEmailVerificationCode(
  userId: string,
  email: string
): Promise<string> {
  await db
    .delete(TableEmailVerificationCode)
    .where(eq(TableEmailVerificationCode.userId, userId));
  const code = generateRandomString(6, alphabet("0-9"));
  await db
    .insert(TableEmailVerificationCode)
    .values({
      userId: userId,
      email,
      code,
      expiresAt: createDate(new TimeSpan(5, "m")).toISOString(),
    })
    .run();

  return code;
}

async function sendVerificationCode(email: string, code: string) {
  console.log("sendVerificationCode", email, code);
  await sendEmail(email, code);
}
import { generateId } from "lucia";

export async function handleSignup(email: string, userInfo: UserInfo) {
  console.log("handleSignup", email);
  const existingUser = await db
    .select()
    .from(TableUser)
    .where(eq(TableUser.email, email));
  console.log("existingUser", existingUser);
  let userId: string;
  console.log("existingUser", existingUser.length);
  if (existingUser.length === 0) {
    console.log("existing user");
    userId = generateId(14);
    console.log("userId", userId);

    await db.insert(TableUser).values({
      emailVerified: false,
      email: email,
      id: userId,
      userInfo,
    });
    console.log("inserted user");
  } else {
    return { error: "user already exists" };
  }
  console.log("userId", userId);

  const verificationCode = await generateEmailVerificationCode(userId, email);
  await sendVerificationCode(email, verificationCode);

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  console.log("sending response to client");
  return { sessionCookie: sessionCookie.serialize() };
}

export async function handleSignIn(email: string) {
  console.log("handleSignup", email);
  const existingUser = await db
    .select()
    .from(TableUser)
    .where(eq(TableUser.email, email));
  console.log("existingUser", existingUser);
  let userId: string;
  console.log("existingUser", existingUser.length);
  if (!existingUser[0]) {
    return { error: "user not found" };
  }

  userId = existingUser[0].id;

  const verificationCode = await generateEmailVerificationCode(userId, email);
  await sendVerificationCode(email, verificationCode);

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  console.log("sending response to client");
  return { sessionCookie: sessionCookie.serialize() };
}

export async function getUserData(sessionId: string) {
  const { user } = await lucia.validateSession(sessionId);

  return user;
}

import { isWithinExpirationDate } from "oslo";
import type { User } from "lucia";
import { db } from "../db/db";
import {
  UserInfo,
  TableEmailVerificationCode,
  TableUser,
} from "../db/schema/auth";
import { lucia } from "./lucia";
import { sendEmail } from "../email";

function redirect(url: string) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: url,
    },
  });
}

export async function handleEmailVerification(
  signInEmail: string,
  code: string
) {
  if (typeof code !== "string") {
    return redirect("/auth/verify");
  }

  const validCode = await verifyVerificationCode(signInEmail, code);
  if (!validCode) {
    console.log("invalid code here");
    return redirect("/auth/verify?error=invalid-code");
  }

  const userItem = await db
    .select()
    .from(TableUser)
    .where(eq(TableUser.email, signInEmail));

  if (!userItem[0]) {
    return redirect("/auth/verify?error=invalid-code");
  }

  const userId = userItem[0].id;

  await db
    .update(TableUser)
    .set({ emailVerified: true })
    .where(eq(TableUser.id, userId))
    .run();

  await lucia.invalidateUserSessions(userId);

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": sessionCookie.serialize(),
    },
  });

  // console.log("sending response to client");
  // return { sessionCookie: sessionCookie.serialize() };

  // const session = await lucia.createSession(user.id, {});
  // const sessionCookie = lucia.createSessionCookie(session.id);
  // console.log("sending response to client");
  // return new Response(null, {
  //   status: 302,
  //   headers: {
  //     Location: "/",
  //     "Set-Cookie": sessionCookie.serialize(),
  //   },
  // });
}

async function verifyVerificationCode(
  signInEmail: string,
  code: string
): Promise<boolean> {
  console.log("verifyVerificationCode", signInEmail, code);
  const databaseCode = await db
    .select({
      code: TableEmailVerificationCode.code,
      expiresAt: TableEmailVerificationCode.expiresAt,
      id: TableEmailVerificationCode.id,
      email: TableEmailVerificationCode.email,
    })
    .from(TableEmailVerificationCode)
    .where(eq(TableEmailVerificationCode.email, signInEmail))
    .get();

  console.log("databaseCode", databaseCode);

  console.log("databaseCode", databaseCode);
  if (!databaseCode || databaseCode.code !== code) {
    console.log("invalid code here");
    return false;
  }
  await db
    .delete(TableEmailVerificationCode)
    .where(eq(TableEmailVerificationCode.id, databaseCode.id))
    .run();

  if (!isWithinExpirationDate(new Date(databaseCode.expiresAt))) {
    console.log("invalid code here because expired");
    return false;
  }
  if (databaseCode.email !== signInEmail) {
    return false;
  }
  return true;
}
