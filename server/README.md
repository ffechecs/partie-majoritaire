# Elysia with Bun runtime

## Getting Started

To get started with this template, simply paste this command into your terminal:

```bash
bun create elysia ./elysia-example
```

## Development

To start the development server run:

```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.

Postgres cluster test-bun-server-chess-db created
Username: postgres
Password: dP4pVeNugXqC0lJ
Hostname: test-bun-server-chess-db.internal
Flycast: fdaa:1:7ea4:0:1::2
Proxy port: 5432
Postgres port: 5433
Connection string: postgres://postgres:dP4pVeNugXqC0lJ@test-bun-server-chess-db.flycast:5432

We have to use elysia@1.0.21 because of a bug in the type inference
The client side will infer every response as File from 1.0.22
https://github.com/elysiajs/elysia/compare/321a7c5539b9503cfd9169f8c313643c351037b0...da63011c213158853e129d9668c1bb95f908c7d1
