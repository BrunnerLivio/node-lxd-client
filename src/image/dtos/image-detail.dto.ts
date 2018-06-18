export interface Properties {
    readonly architecture: string;
    readonly build: string;
    readonly description: string;
    readonly distribution: string;
    readonly os: string;
    readonly release: string;
    readonly serial: string;
}

export interface ImageDetail {
    readonly auto_update: boolean;
    readonly properties: Properties;
    readonly public: boolean;
    readonly aliases: any[];
    readonly architecture: string;
    readonly cached: boolean;
    readonly filename: string;
    readonly fingerprint: string;
    readonly size: number;
    readonly created_at: Date;
    readonly expires_at: Date;
    readonly last_used_at: Date;
    readonly uploaded_at: Date;
}

