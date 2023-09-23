import { Router } from "./router";
import { unwrap } from "./result.ts"
import { Resolver } from "./resolver.ts";

const server = Bun.serve({
    port: 3000,
    async fetch(request) {
        const routeResult = await new Router(request).route();
        if (!routeResult.ok) {
            return new Response(routeResult.error, { status: 404 });
        }
        const route = unwrap(routeResult);

        const eventResult = await new Resolver().fetch([route.rootEventId, route.eventId]);
        if (!eventResult.ok) {
            return new Response(eventResult.error, { status: 404 });
        }

        const [rootEvent, contentEvent] = unwrap(eventResult);
        if (rootEvent.pubkey !== contentEvent.pubkey) {
            return new Response(`Refusing to serve event which is not signed by the domain's root event pubkey. Root pubkey: ${rootEvent.pubkey}`, { status: 400 });
        }

        return new Response(contentEvent.content, { headers: { "Content-Type": "text/html" } });
    },  
});

console.log(`Listening on localhost:${server.port}`);
