import { Client } from '../client';
import { Service } from '../service';

export class ImageService extends Service {
    constructor(client: Client) {
        super('/1.0/images', client);
    }

    private getFingerprintFromUri(uri: string) {
        const splitted = uri.split('/');
        return splitted[splitted.length - 1];
    }

    async all(lazy: boolean = false): Promise<any[]> {
        const data = await this.get('');
        if (lazy) {
            return data.metadata;
        } else {
            const metadata = data.metadata.map(uri => this.getFingerprintFromUri(uri));
            return await Promise.all(
                metadata.map(async (fingerprint) =>
                    await this.one(fingerprint)));
        }
    }

    async one(fingerprint: string): Promise<object> {
        const req = await this.get('/' + fingerprint);
        return req.metadata;
    }
}