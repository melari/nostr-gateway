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

`docker login ghcr.io -u melari`
`docker build -t ghcr.io/melari/nostr-gateway:latest .`
`docker push ghcr.io/melari/nostr-gateway:latest`
