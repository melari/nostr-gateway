import { Nullable } from "./types";

export class DnsClient {
    static readonly BASE_URL = 'https://1.1.1.1/dns-query?type=TXT&name=';
    static readonly HEADERS = { 'accept': 'application/dns-json' };

    public async txt(domain: string): Promise<string> {
        return fetch(DnsClient.BASE_URL + domain, { headers: DnsClient.HEADERS })
            .then(response => response.json())
            .then(data => {
                if (data["Answer"]) {
                    return data["Answer"][0]["data"].replace(/[^a-zA-Z0-9\/=]/g, '');
                } else {
                    return '';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                return null;
            });
    }

    public async nostr(domain: string): Promise<Nullable<string>> {
        const dnslink = await this.txt(`_dnslink.${domain}`);
        const match = dnslink.match(/^dnslink=\/nostr\/(.*)$/);
        if (!match) { return null; }
        return match[1];
    }
}