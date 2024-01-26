FROM oven/bun:1.0.25

COPY package.json ./
COPY bun.lockb ./
COPY src ./src

RUN mkdir ./dist
RUN bun install
RUN bun build --target=bun ./src/index.ts --outfile=./dist/server.js

EXPOSE 3000
CMD bun run ./dist/server.js
