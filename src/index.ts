import { Router } from "./router";
import { unwrap } from "./result.ts"
import { Resolver } from "./resolver.ts";

const server = Bun.serve({
    port: 3000,
    async fetch(request) {
        const route = await new Router(request).route();
        if (!route.ok) {
            return new Response(route.error, { status: 404 });
        }

        const content = await new Resolver().fetchContents(unwrap(route).eventId);
        if (!content.ok) {
            return new Response(content.error, { status: 404 });
        }

        return new Response(unwrap(content));
    },  
});

console.log(`Listening on localhost:${server.port}`);
