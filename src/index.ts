import { Router } from "./router";

const server = Bun.serve({
    port: 3000,
    fetch(request) {
        const router = new Router(request);
        router.route();

        return new Response("Welcome to Bun!");
    },  
});

console.log(`Listening on localhost:${server.port}`);