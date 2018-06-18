export interface Properties {
    architecture: string;
    build: string;
    description: string;
    distribution: string;
    os: string;
    release: string;
    serial: string;
}

export interface ImageDetail {
    auto_update: boolean;
    properties: Properties;
    public: boolean;
    aliases: any[];
    architecture: string;
    cached: boolean;
    filename: string;
    fingerprint: string;
    size: number;
    created_at: Date;
    expires_at: Date;
    last_used_at: Date;
    uploaded_at: Date;
}

