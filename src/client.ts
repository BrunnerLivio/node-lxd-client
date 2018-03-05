import url from 'url';

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
        const parsedUrl: URL = url.parse(this.settings.host);
        return parsedUrl.port ? `:${parsedUrl.port}/` : '/';
    }

    private getHostUri(): string {
        if (this.isLocal) {
            return `http://unix:/varlib/lxd/unix.socket:/`;
        } else {
            const parsedUrl: URL = url.parse(this.settings.host);
            const port: string = this.getPortString();
            return `${parsedUrl.protocol}//${parsedUrl.hostname}${port}`;
        }
    }

    private getWebsocketUri(): string {
        if (this.isLocal) {
            return 'ws+unix:///var/lib/lxd/unix.socket:/';
        } else {
            const parsedUrl: URL = url.parse(this.settings.host);
            const port: string = this.getPortString();
            return `ws://${parsedUrl.protocol}${port}`;
        }
    }
}