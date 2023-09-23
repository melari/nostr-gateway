import NDK, { NDKFilter, NDKEvent } from "@nostr-dev-kit/ndk";
import { Result, err, wrap, unwrap } from "./result";

export class Resolver {
    static readonly RELAYS = [
        "wss://nos.lol",
        "wss://relay.damus.io",
        "wss://nostr.wine",
    ];

    private ndk;
    private connected = false;

    constructor() {
        this.ndk = new NDK({
            explicitRelayUrls: Resolver.RELAYS,
        });
    }

    public async fetch(eventIds: string[]): Promise<Result<NDKEvent[]>> {
        await this.ensureConnected();
        const filter: NDKFilter = { ids: eventIds };
        const events = await this.ndk.fetchEvents(filter) as Set<NDKEvent>;
        const orderedResult = eventIds.map((eventId) => {
            const e = [...events].find(e => e.id === eventId);
            if (!e) { return err(`${eventId} was not found on nostr relays`); }
            return e
        });
        return wrap(orderedResult);
    }

    private async ensureConnected(): Promise<void> {
        if (this.connected) { return; }
        this.ndk.connect();
        let timeOut = 50;
        while (this.ndk.pool.stats().connected < 1) {
            if (timeOut-- === 0) { throw new Error('timeout connecting to relays'); }
            await Bun.sleep(100);
        }
        this.connected = true;
    }
}