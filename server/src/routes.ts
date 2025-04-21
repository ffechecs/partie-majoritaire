import {
  addGame,
  addPlayer,
  deleteGame,
  editGame,
  findPlayerWithUserId,
  getGame,
  getGameByCode,
  getGameFull,
  getGamesVisibleInAdmin,
  getPlayer,
  getPlayers,
} from "./methods";

import {Elysia, t} from "elysia";
import {authMiddleware} from "./middleware";
import {editUser, getUser, getUsers} from "./methods/users";
import {userInfoSchema} from "./db/schema/auth";
import {client} from "./db/db";

const gameRoutes = new Elysia()
  .use(authMiddleware)
  .get("/players", async () => {
    return await getPlayers();
  })
  .get("players/:id", async ({ params }) => {
    return await getPlayer(params.id);
  })
  .post(
    "/players",
    async ({ body, headers, user, session }) => {
      if (!user) {
        throw new Error("User not found");
      }
      const existingPlayer = await findPlayerWithUserId(user.id);
      if (existingPlayer) {
        return existingPlayer;
      }
      return await addPlayer({
        name: body.name,
        userId: user.id,
      });
    },
    { body: t.Object({ name: t.String() }) }
  )
  .get("/games", async ({ user }) => {
    if (!user) {
      throw new Error("User not found");
    }
    return await getGamesVisibleInAdmin(user);
  })
  .delete("/games/:id", async ({ params }) => {
    await deleteGame(params.id);
    return {
      success: true,
    };
  })
  .get("/games/:id", async ({ params }) => {
    const game = await getGame(params.id);
    return {
      game,
    };
  })
  .get("/games/:id/full", async ({ params }) => {
    const game = await getGameFull(params.id);
    return {
      game,
    };
  })
  .post(
    "/games",
    async ({ body, user }) => {
      if (process.env.NODE_ENV == "production" && !user) {
        throw new Error("User not found");
      }
      const game = body;
      return await addGame({
          name: game.name,
          settings: game.settings,
          createdBy: user?.id || "pq5v8jhz86c17x",
      });
    },
    {
      body: t.Object({
        name: t.String(),
        settings: t.Object({
          challengerColor: t.Union([t.Literal("white"), t.Literal("black")]),
          challengerTime: t.Number(),
          majorityTime: t.Number(),
          isGameForSchools: t.Boolean(),
          challengerMoveConfirmation: t.Boolean(),
          liveStreamUrl: t.Optional(t.String()),
        }),
      }),
    }
  )
  .patch(
    "/games",
    async ({ body, user }) => {
      if (!user) {
        throw new Error("User not found");
      }

      const selectedGame = await getGame(body.id);
      if (!selectedGame) {
        throw new Error("Game not found");
      }

      if (user.role != "superadmin" && selectedGame.createdBy != user.id) {
        throw new Error("You are not the owner of this game");
      }

      const game = body;
      return await editGame({
        id: game.id,
        name: game.name,
        settings: game.settings,
      });
    },
    {
      body: t.Object({
        id: t.String(),
        name: t.String(),
        settings: t.Object({
          challengerColor: t.Union([t.Literal("white"), t.Literal("black")]),
          challengerTime: t.Number(),
          majorityTime: t.Number(),
          isGameForSchools: t.Boolean(),
          challengerMoveConfirmation: t.Boolean(),
          liveStreamUrl: t.Optional(t.String()),
        }),
      }),
    }
  )
  .get("/games/code/:code", async ({ params }) => {
    return await getGameByCode(params.code);
  });

export const userRoutes = new Elysia()
  .use(authMiddleware)
  .get("/users", async (user) => {
    if (!user) {
      throw new Error("User not found");
    }
    return await getUsers();
  })
  .get("/users/:id", async ({ params }) => {
    return await getUser(params.id);
  })
  //edit a user
  .patch(
    "/users/:id",
    async ({ params, body, user }) => {
      if (!user || user.role != "superadmin") {
        throw new Error("You are not superadmin");
      }

      return await editUser(params.id, body);
    },
    {
      body: t.Object({
        role: t.Optional(
          t.Union([
            t.Literal("user"),
            t.Literal("admin"),
            t.Literal("superadmin"),
          ])
        ),
        userInfo: t.Optional(userInfoSchema),
      }),
    }
  );

export const accountRoutes = new Elysia().use(authMiddleware).patch(
  "/users",
  async ({ body, user }) => {
    if (!user) {
      throw new Error("User not found");
    }

    console.log("EDIT USER WITH", { id: user.id, body });

    const editedUser = await editUser(user.id, body);

    return {
      editedUser,
    };
  },
  {
    body: t.Object({
      userInfo: t.Optional(userInfoSchema),
    }),
  }
);

export const normalRoutes = new Elysia()
  .use(gameRoutes)
  .use(userRoutes)
  .use(accountRoutes)
  .get("/db:sync", async () => {
    await client.sync();
    return "ok";
  });
