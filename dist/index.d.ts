import Transport from 'winston-transport';
export interface TransformableInfo {
    level: string;
    message: string;
    [key: string]: any;
}
export interface SlackMessage {
    text?: string;
    attachments?: any[];
    blocks?: any[];
    icon_emoji?: string;
    username?: string;
    icon_url?: string;
    channel?: string;
}
export interface SlackHookOptions {
    agent?: any;
    webhookUrl: string;
    name?: string;
    formatter?: (info: TransformableInfo) => SlackMessage | false;
    level?: string;
    unfurlLinks?: boolean;
    unfurlMedia?: boolean;
    mrkdwn?: boolean;
    proxy?: any;
    channel?: string;
    username?: string;
    iconEmoji?: string;
    iconUrl?: string;
}
export declare class SlackTransport extends Transport {
    private opts;
    private axiosInstance;
    constructor(opts: SlackHookOptions);
    log(info: any, callback: any): void;
}
