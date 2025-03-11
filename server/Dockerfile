FROM oven/bun:debian

RUN apt-get update
# install python
RUN apt-get install -y python3 python3-pip
# install packages for sqlite
RUN apt-get install -y libsqlite3-dev libssl-dev sqlite3

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --force


COPY src src
COPY tsconfig.json .
# COPY public public

ENV NODE_ENV production

# RUN bun build --compile --minify src/index.ts --outfile server_binary

# CMD ["./server_binary"]

CMD ["bun", "src/index.ts"]

EXPOSE 3001
