import { Client } from '../client';
import { RESTApiMetadata } from '../dtos';
import { Service } from '../service';
import { ImageDetail, SourceImageDto } from './dtos';


export type ImageResponse = RESTApiMetadata<string[]>;
export type ImageDetailResponse = RESTApiMetadata<ImageDetail>;

export class ImageService extends Service {
    constructor(client: Client) {
        super('/1.0/images', client);
    }

    private getFingerprintFromUri(uri: string) {
        const splitted = uri.split('/');
        return splitted[splitted.length - 1];
    }

    async all(lazy: boolean = false): Promise<ImageDetail[] | string[]> {
        const data = await this.get('') as ImageResponse;
        if (lazy) {
            return data.metadata;
        } else {
            const metadata = data.metadata.map(uri => this.getFingerprintFromUri(uri));
            return await Promise.all(
                metadata.map(async (fingerprint) =>
                    await this.one(fingerprint)));
        }
    }

    async one(fingerprint: string): Promise<ImageDetail> {
        const req = await this.get('/' + fingerprint) as ImageDetailResponse;
        return req.metadata;
    }

    async create(sourceImageDto: SourceImageDto) {
        await this.post('', sourceImageDto);
    }
}
