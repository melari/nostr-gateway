import { Router } from "./router";
import { unwrap } from "./result.ts"
import { Resolver } from "./resolver.ts";
const tls = require('node:tls');
const https = require('node:https');
const fs = require('node:fs');

const secureContext = {
    'mydomain.com': tls.createSecureContext({
        key: "key",
        cert: "cert",
        ca: "ca", // this ca property is optional
    }),
    'myotherdomain.com': tls.createSecureContext({
        key: "key",
        cert: "cert",
        ca: "ca", // this ca property is optional
    }),
}

const options = {
    /*SNICallback: function (domain: string, cb: any) {
        console.log(domain);
        if (secureContext[domain]) {
            if (cb) {
                console.log("1");
                cb(null, secureContext[domain]);
            } else {
                console.log("2")
                // compatibility for older versions of node
                return secureContext[domain]; 
            }
        } else {
            throw new Error('No keys/certificates for domain requested');
        }
    },*/
   // must list a default key and cert because required by tls.createServer()
    key: fs.readFileSync("./default-key.pem"), 
    cert: fs.readFileSync("./default-cert.pem"), 
}

/*
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
    tls: {
        SNICallback: (domain: string, cb: any) =>  {
            console.log(domain);
        },
        s
    }
});*/

const server = https.createServer(options, (req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
}).listen(8080); 

console.log(`Listening on localhost:${server.port}`);
