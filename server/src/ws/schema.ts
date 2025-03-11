import { t, Static } from "elysia";

const gameSchema = t.Object({
  id: t.String(),
  name: t.String(),
  createdAt: t.String(),
  settings: t.Object({
    challengerColor: t.Union([t.Literal("white"), t.Literal("black")]),
    challengerTime: t.Number(),
    majorityTime: t.Number(),
    isGameForSchools: t.Boolean(),
    liveStreamUrl: t.Optional(t.String()),
  }),
  majorityCode: t.String(),
  challengerCode: t.String(),
});

const playerSchema = t.Object({
  id: t.String(),
  name: t.String(),
  createdAt: t.String(),
});

const playerConnectionSchema = t.Object({
  id: t.String(),
  playerId: t.String(),
  connected: t.Number(),
  createdAt: t.String(),
  gameId: t.String(),
});

const moveSchema = t.Object({
  id: t.String(),
  gameId: t.String(),
  playerId: t.Union([t.String(), t.Null()]),
  moveSan: t.String(),
  fen: t.String(),
  moveNumber: t.Number(),
  color: t.Union([t.Literal("white"), t.Literal("black")]),
  createdAt: t.String(),
  startSquare: t.String(),
  endSquare: t.String(),
});
export const voteSchema = t.Object({
  id: t.String(),
  gameId: t.String(),
  playerId: t.String(),
  moveSan: t.String(),
  color: t.Union([t.Literal("white"), t.Literal("black")]),
  fen: t.String(),
  moveNumber: t.Number(),
  createdAt: t.String(),
  startSquare: t.String(),
  endSquare: t.String(),
});

export const wsBodySchema = t.Union([
  t.Object({
    type: t.Literal("vote"),
    data: t.Object({
      gameId: t.String(),
      moveSan: t.String(),
      fen: t.String(),
      moveNumber: t.Number(),
      playerId: t.String(),
      color: t.Union([t.Literal("white"), t.Literal("black")]),
      startSquare: t.String(),
      endSquare: t.String(),
    }),
  }),
  t.Object({
    type: t.Literal("move"),
    data: t.Object({
      gameId: t.String(),
      moveSan: t.String(),
      fen: t.String(),
      moveNumber: t.Number(),
      color: t.Union([t.Literal("white"), t.Literal("black")]),
      startSquare: t.String(),
      endSquare: t.String(),
    }),
  }),
  t.Object({
    type: t.Literal("endVote"),
  }),
]);

export const wsResponseSchema = t.Union([
  t.Object({
    type: t.Literal("connect"),
    data: t.Object({
      players: t.Array(playerSchema),
      votes: t.Array(voteSchema),
      moves: t.Array(moveSchema),
      lastMove: t.Union([moveSchema, t.Null()]),
      lastUserVote: t.Union([voteSchema, t.Null()]),
      hasUserVoted: t.Boolean(),
      allUserVotes: t.Array(voteSchema),
      game: gameSchema,
    }),
  }),
  t.Object({
    type: t.Literal("playerConnect"),
    player: playerSchema,
  }),
  t.Object({
    type: t.Literal("playerDisconnect"),
    playerId: t.String(),
  }),
  t.Object({
    type: t.Literal("vote"),
    vote: voteSchema,
  }),
  t.Object({
    type: t.Literal("move"),
    move: moveSchema,
  }),
  t.Object({
    type: t.Literal("gameOver"),
    winner: t.Union([t.Literal("white"), t.Literal("black")]),
  }),
  t.Object({
    type: t.Literal("refresh"),
  }),
]);
import { UnwrapSchema } from "elysia";
export type WsResponseSchema = UnwrapSchema<typeof wsResponseSchema>;
