import { Client, ClientSettings } from './client';
import { ImageService } from './image/image.service';
import * as Winston from 'winston';

export interface LXDSettings extends ClientSettings { 
    debug?: 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';
}

export class LXDRemoteClient {
    private client: Client;
    private imageService: ImageService;
    constructor(private settings: LXDSettings) {
        this.client = new Client(this.settings);
        this.imageService = new ImageService(this.client);
        // @ts-ignore
        Winston.level = this.settings.debug || 'warn';
        Winston.remove(Winston.transports.Console);
        Winston.add(Winston.transports.Console);
    }

    public get image(): ImageService {
        Winston.log('silly', 'Returning image service instance');
        return this.imageService;
    }

    public authorizeCertificate(): Promise<any> {
        Winston.log('Silly', 'Calling "authorizingService"');
        return this.client.authorizeCertificate();
    }
}
