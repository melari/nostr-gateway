import NDK, { NDKFilter } from "@nostr-dev-kit/ndk";
import { Result, err, wrap } from "./result";

export class Resolver {
    static readonly RELAYS = [
        'wss://relay.damus.io'
    ];

    private ndk;
    private connected = false;

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
        if (this.connected) { return; }
        await this.ndk.connect();
        this.connected = true;
    }
}