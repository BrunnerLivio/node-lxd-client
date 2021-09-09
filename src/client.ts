import * as Url from 'url';
import * as Request from 'request-promise';

export interface ClientSettings {
  host?: string;
  cert?: string;
  key?: string;
  password?: string;
}

export class Client {
  private hostUri: string;
  private websocketUri: string;
  private isLocal: boolean;
  constructor(private settings: ClientSettings) {
    this.isLocal = settings.host === undefined;
    this.hostUri = this.getHostUri();
    this.websocketUri = this.getWebsocketUri();
  }

  private getPortString() {
    const parsedUrl: Url.UrlWithStringQuery = Url.parse(this.settings.host);
    return parsedUrl.port ? `:${parsedUrl.port}` : '';
  }

  private getHostUri(): string {
    if (this.isLocal) {
      return `http://unix:/varlib/lxd/unix.socket:/`;
    } else {
      const parsedUrl: Url.UrlWithStringQuery = Url.parse(this.settings.host);
      const port: string = this.getPortString();
      return `${parsedUrl.protocol}//${parsedUrl.hostname}${port}`;
    }
  }

  private getWebsocketUri(): string {
    if (this.isLocal) {
      return 'ws+unix:///var/lib/lxd/unix.socket:/';
    } else {
      const parsedUrl: Url.UrlWithStringQuery = Url.parse(this.settings.host);
      const port: string = this.getPortString();
      return `ws://${parsedUrl.protocol}${port}`;
    }
  }

  public async get(url: string) {
    const request = {
      method: 'GET',
      uri: this.hostUri + url,
      cert: this.settings.cert,
      key: this.settings.key,
      rejectUnauthorized: false,
      json: true
    };
    return Request(request);
  }

  public async post(url: string, body: any) {
    return Request({
      method: 'GET',
      uri: this.hostUri + url,
      cert: this.settings.cert,
      key: this.settings.key,
      rejectUnauthorized: false,
      json: body
    });
  }

  authorizeCertificate(): Promise<any> {
    return new Promise((resolve, reject) => {
      const request: any = {
        method: 'POST',
        uri: this.hostUri + '1.0/certificates',
        body: {
          password: this.settings.password,
          type: 'client'
        },
        rejectUnauthorized: false,
        json: true
      };

      request.cert = this.settings.cert;
      request.key = this.settings.key;
      Request(request)
        .then(data => resolve(data))
        .catch(data =>
          data && data.statusCode === 400 ? resolve(data) : reject(data)
        );
    });
  }
}
