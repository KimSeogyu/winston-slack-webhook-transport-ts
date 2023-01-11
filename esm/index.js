import axios from 'axios';
import Transport from 'winston-transport';
export class SlackTransport extends Transport {
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
        this.axiosInstance = axios.create(config);
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
//# sourceMappingURL=index.js.map