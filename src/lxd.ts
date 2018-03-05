import { Client, ClientSettings } from './client';

export interface LXDSettings extends ClientSettings {}

export class LXD {
    client: Client;
    constructor(private settings: LXDSettings) {
        this.client = new Client(this.settings);
    }
}