import { Client, ClientSettings } from './client';
import { ImageService } from './image/image.service';

export interface LXDSettings extends ClientSettings { }

export class LXD {
    private client: Client;
    private imageService: ImageService;
    constructor(private settings: LXDSettings) {
        this.client = new Client(this.settings);
        this.imageService = new ImageService(this.client);
    }

    public get image(): ImageService {
        return this.imageService;
    }

    public authorizeCertificate(): Promise<any> {
        return this.client.authorizeCertificate();
    }
}