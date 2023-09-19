# nostr-gateway
HTTP server for web clients to access nostr backed files

# Development & Building

Install bun:
`$ curl -fsSL https://bun.sh/install | bash`

Install packages:
`$ bun install`

Run a development server:
`$ bun run --watch src/index.ts`

## Building for production

Compile:
`$ bun build --target=bun ./src/index.ts --outfile=dist/server.js`

Run:
`$ bun run dist/server.js`