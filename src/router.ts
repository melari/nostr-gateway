import { DnsClient } from "./dns-client";

export class Router {
    private url: URL;

    constructor(request: Request) {
        this.url = new URL(request.url);
    }

    public async route(): Promise<void> {
        const dnsClient = new DnsClient();
        const npub = await dnsClient.nostr(this.url.hostname);
        console.log(await dnsClient.nostr("tagayasu.xyz"));
    }
}