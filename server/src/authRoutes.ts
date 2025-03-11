import { Cookie, Elysia, t } from "elysia";
import {
  getUserData,
  handleEmailVerification,
  handleSignIn,
  handleSignup,
} from "./auth/code";
import { lucia } from "./auth/lucia";
import { authMiddleware } from "./middleware";
import { userInfoSchema } from "./db/schema/auth";
import { serializeCookie } from "oslo/cookie";

export const authRoutes = new Elysia()
  .post(
    "/auth/sign-up",
    async ({ body, set, cookie }) => {
      const res = await handleSignup(body.email, body.userInfo);
      if (res.error != undefined) {
        return new Response(JSON.stringify(res), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      const cookies = serializeCookie("sign_in_email", body.email, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/auth/verify",
          "Set-Cookie": cookies,
        },
      });
    },
    {
      body: t.Object({
        email: t.String(),
        userInfo: userInfoSchema,
      }),
    },
  )
  .post(
    "/auth/sign-in",
    async ({ body, set }) => {
      const res = await handleSignIn(body.email);
      if (res.error != undefined) {
        return new Response(JSON.stringify(res), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      // cookie for current sign_in_email
      const cookies = serializeCookie("sign_in_email", body.email, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/auth/verify",
          "Set-Cookie": cookies,
        },
      });
    },
    {
      body: t.Object({
        email: t.String(),
      }),
    },
  )
  .get("/status", async ({ set }) => {
    return {
      text: "Hello World",
    };
  })
  .post("/auth/user", async ({ cookie }) => {
    // print session cookie
    const sessionCookie = cookie["auth_session"];
    if (!sessionCookie) {
      return {
        success: false,
      };
    }
    const user = await getUserData(sessionCookie.value);
    if (!user) {
      return {
        success: false,
      };
    }
    return {
      success: true,
      user,
    };
  })
  .get("/auth/user", async ({ cookie }) => {
    console.log("Starting /auth/user route");
    console.log("Checking for auth_session cookie");
    console.log("cookie", cookie);
    const sessionCookie = cookie["auth_session"];
    if (!sessionCookie) {
      console.log("No auth_session cookie found");
      return {
        success: false,
      };
    }
    console.log("auth_session cookie found");
    console.log("Attempting to get user data");
    const user = await getUserData(sessionCookie.value);
    if (!user) {
      console.log("No user data found");
      return {
        success: false,
      };
    }
    console.log("User data retrieved successfully");
    console.log("Returning user data");
    return {
      success: true,
      user,
    };
  })
  .get("/auth/logout", async ({ cookie, set }) => {
    console.log("logout");
    const sessionCookie = cookie["auth_session"];

    if (!sessionCookie) {
      return {
        success: false,
      };
    }
    await lucia.invalidateSession(sessionCookie.value);

    const newSessionCookie = lucia.createBlankSessionCookie();

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
        "Set-Cookie": newSessionCookie.serialize(),
      },
    });
  })
  .post(
    "/auth/verify",
    async ({ body, cookie }) => {
      console.log("Starting email verification process");
      console.log(JSON.stringify(cookie, null, 2));
      const signInEmail = cookie["sign_in_email"]?.value;
      console.log("Sign-in email from cookie:", signInEmail);
      if (!signInEmail) {
        console.log("No sign-in email found in cookie, returning 401");
        return new Response(null, {
          status: 401,
        });
      }
      console.log("Attempting to verify email with PIN");
      const res = await handleEmailVerification(signInEmail, body.pin);
      console.log("Email verification result:", res);
      return res;
    },
    {
      body: t.Object({
        pin: t.String(),
      }),
    },
  );
