import { DnsClient } from "./dns-client";
import { Result, err, wrap } from "./result";

export type Route = {
    eventId: string,
}

export class Router {
    static readonly NOSTR_ROUTE_SIGNAL = '/_/';
    static readonly NOSTR_ROUTE_SIGNAL_LENGTH = this.NOSTR_ROUTE_SIGNAL.length;
    static readonly NOSTR_EVENT_FORMAT = /^[a-z0-9]{64}$/;
    private url: URL;

    constructor(request: Request) {
        this.url = new URL(request.url);
    }

    public async route(): Promise<Result<Route>> {
        if (this.url.pathname.startsWith(Router.NOSTR_ROUTE_SIGNAL)) {
            return this.toRoute(this.url.pathname.slice(Router.NOSTR_ROUTE_SIGNAL_LENGTH));
        }

        const dnsClient = new DnsClient();
        const eventId = await dnsClient.nostr("tagayasu.xyz" || this.url.hostname);
        if (!eventId) { return err(`${this.url.hostname} does not have nostr dnslink configured.`); }
        return this.toRoute(eventId);
    }

    private toRoute(eventId: string): Result<Route> {
        if (!Router.NOSTR_EVENT_FORMAT.test(eventId)) {
            return err(`${eventId} is not a valid nostr event ID. It should be a 64 byte, lowercase, hex encoded string.`);
        }
        return wrap({ eventId });
    }
}