import { Client } from './client';

export abstract class Service {
  constructor(private url: string, protected client: Client) {}

  protected async get(url) {
    return this.client.get(this.url + url);
  }

  protected async post(url, body) {
    return this.client.post(this.url + url, body);
  }
}
