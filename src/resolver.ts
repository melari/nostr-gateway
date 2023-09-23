import NDK, { NDKFilter } from "@nostr-dev-kit/ndk";
import { Result, err, wrap } from "./result";

export class Resolver {
    static readonly RELAYS = [
        "wss://nos.lol",
        "wss://relay.damus.io",
        "wss://nostr.wine",
    ];

    private ndk;

    constructor() {
        this.ndk = new NDK({
            explicitRelayUrls: Resolver.RELAYS,
        });
    }

    public async fetchContents(eventId: string): Promise<Result<string>> {
        await this.ensureConnected();
        const filter: NDKFilter = { ids: [eventId] };
        const event = await this.ndk.fetchEvent(filter);
        if (!event) { return err(`${eventId} was not found on nostr relays`); }
        return wrap(event.content);
    }

    private async ensureConnected(): Promise<void> {
        this.ndk.connect();
        let timeOut = 50;
        while (this.ndk.pool.stats().connected < 1) {
            if (timeOut-- === 0) { throw new Error('timeout connecting to relays'); }
            await Bun.sleep(100);
        }
    }
}