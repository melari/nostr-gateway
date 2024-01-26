import { DnsClient } from "./dns-client";
import { Result, err, wrap } from "./result";

export type Route = {
    rootEventId: string,
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
        const dnsClient = new DnsClient();
        const rootEventId = await dnsClient.nostr(this.url.hostname);
        if (!rootEventId) { return err(`${this.url.hostname} does not have nostr dnslink configured.`); }

        if (this.url.pathname.startsWith(Router.NOSTR_ROUTE_SIGNAL)) {
            return this.toRoute(rootEventId, this.url.pathname.slice(Router.NOSTR_ROUTE_SIGNAL_LENGTH));
        }
        return this.toRoute(rootEventId, rootEventId);
    }

    private toRoute(rootEventId: string, eventId: string): Result<Route> {
        [rootEventId, eventId].forEach((eventId) => {
            if (!Router.NOSTR_EVENT_FORMAT.test(eventId)) {
                return err(`${eventId} is not a valid nostr event ID. It should be a 64 byte, lowercase, hex encoded string.`);
            }
        });
        return wrap({ rootEventId, eventId });
    }
}
