"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackTransport = void 0;
const axios_1 = __importDefault(require("axios"));
const winston_transport_1 = __importDefault(require("winston-transport"));
class SlackTransport extends winston_transport_1.default {
    opts;
    axiosInstance;
    constructor(opts) {
        super(opts);
        this.opts = opts;
        const config = {};
        if (opts.agent)
            config.agent = opts.agent;
        if (opts.proxy)
            config.proxy = opts.proxy;
        this.axiosInstance = axios_1.default.create(config);
    }
    log(info, callback) {
        let payload = {
            unfurl_links: this.opts.unfurlLinks,
            unfurl_media: this.opts.unfurlMedia,
            mrkdwn: this.opts.mrkdwn,
            channel: this.opts.channel,
            username: this.opts.username,
            icon_emoji: this.opts.iconEmoji,
            icon_url: this.opts.iconUrl,
            text: undefined,
        };
        if (this.opts.formatter && typeof this.opts.formatter === 'function') {
            let layout = this.opts.formatter(info);
            if (!layout)
                return;
            Object.keys(layout).forEach((key) => {
                payload[key] = layout[key];
            });
        }
        else {
            payload.text = `${info.level}: ${info.message}`;
        }
        this.axiosInstance
            .post(this.opts.webhookUrl, payload)
            .then((response) => {
            callback();
        })
            .catch((err) => {
            callback();
        });
    }
}
exports.SlackTransport = SlackTransport;
//# sourceMappingURL=index.js.map