import * as async from 'async';
import * as Winston from 'winston';

import { Client } from '../client';
import { RESTApiMetadata } from '../dtos';
import { Service } from '../service';
import { ImageDetail, SourceImageDto } from './dtos';


export type ImageResponse = RESTApiMetadata<string[]>;
export type ImageDetailResponse = RESTApiMetadata<ImageDetail>;

const ALL_DEFAULT_SETTINGS: LoadAllImagesSettings =
{
    lazy: false,
    sequentially: false
};

export interface LoadAllImagesSettings {
    lazy: boolean;
    sequentially: boolean;
}

export class ImageService extends Service {
    constructor(client: Client) {
        super('/1.0/images', client);
    }

    private getFingerprintFromUri(uri: string): string {
        const splitted = uri.split('/');
        return splitted[splitted.length - 1];
    }

    private loadAllNonLazy(settings: LoadAllImagesSettings, data: ImageResponse): Promise<ImageDetail[]> {
        const metadata = data.metadata.map(uri => this.getFingerprintFromUri(uri));
        return new Promise<any[]>((resolve, reject) => {
            const callback = (err, results) => err ? reject(err) : resolve(results);

            const itaree = (fingerprint: string, next: Function) => this.one(fingerprint)
                .then(metadata => next(false, metadata));

            if (settings.sequentially) {
                Winston.log('silly', 'Calling mapSeries');
                async.mapSeries(metadata, itaree, callback);
            } else {
                Winston.log('silly', 'Calling map');
                async.map(metadata, itaree, callback);
            }
        });
    }

    async all(): Promise<ImageDetail[]>
    async all(settings: { lazy: false | null } & LoadAllImagesSettings): Promise<ImageDetail[]>
    async all(settings: { lazy: true } & LoadAllImagesSettings): Promise<string[]>
    async all(settings: LoadAllImagesSettings = ALL_DEFAULT_SETTINGS) {
        const data = await this.get('') as ImageResponse;
        return settings.lazy ?
            data.metadata :
            await this.loadAllNonLazy(settings, data);
    }

    async one(fingerprint: string): Promise<ImageDetail> {
        const req = await this.get('/' + fingerprint) as ImageDetailResponse;
        return req.metadata;
    }

    async create(sourceImageDto: SourceImageDto) {
        await this.post('', sourceImageDto);
    }
}
