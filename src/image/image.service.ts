import { Client } from '../client';
import { Service } from '../service';
import * as async from 'async';
import * as Winston from 'winston';

export class ImageService extends Service {
    constructor(client: Client) {
        super('/1.0/images', client);
    }

    private getFingerprintFromUri(uri: string): string{
        const splitted = uri.split('/');
        return splitted[splitted.length - 1];
    }

    async all(lazy: boolean = false, sequentially: boolean = false): Promise<any[]> {
        const data = await this.get('');
        if (lazy) {
            return data.metadata;
        } else {
            const metadata = data.metadata.map(uri => this.getFingerprintFromUri(uri));
    
            return new Promise<any[]>((resolve, reject) => {
                const callback = (err, results) => err ? reject(err) : resolve(results);

                const itaree = (fingerprint: string, next: Function) => this.one(fingerprint)
                    .then(metadata => next(false, metadata));

                if(sequentially) {
                    Winston.log('silly', 'Calling mapSeries');
                    async.mapSeries(metadata, itaree, callback);
                } else {
                    Winston.log('silly', 'Calling map');                    
                    async.map(metadata, itaree, callback);
                }
            });
        }
    }

    async one(fingerprint: string): Promise<object> {
        const req = await this.get('/' + fingerprint);
        return req.metadata;
    }
}