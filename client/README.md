# Partie Majoritaire

## Update to make

- Change schema to allow for game settings

  - Vote color
  - Time limit for vote and main color
  - Game start time and manual start

- Generate a random code to join game one for each color

## List UI

button, card, form, input, label, radio-group, table

## Tree

- /auth (no page)
  - /auth/sign-up
  - /auth/sign-in
  - /auth/sign-verify
- /game
  - /game/create
  - /game/join
  - /game/[gameId]
    - /game/[gameId]/challenger
    - /game/[gameId]/majority
    - /game/[gameId]/majority/[playerId]
    - /game/[gameId]/replay
    - /game/[gameId]/spectator
