import { Client } from './client';

export abstract class Service {
    constructor(private url: string, protected client: Client) { }

    protected async get(url) {
        return this.client.get(this.url + url);
    }
}