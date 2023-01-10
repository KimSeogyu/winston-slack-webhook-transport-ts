# winston-slack-webhook-transport-ts

This repository is forked from https://github.com/TheAppleFreak/winston-slack-webhook-transport

## Changes

1. CommonJS -> ES Module
2. JS -> TS
3. add agent option

![Continuous Integration](https://github.com/SeogyuGim/winston-slack-webhook-transport-ts/actions/workflows/tests.yml/badge.svg) [![npm version](https://badge.fury.io/js/winston-slack-webhook-transport-ts.svg)](https://www.npmjs.com/package/winston-slack-webhook-transport-ts) [![downloads](https://img.shields.io/npm/dw/winston-slack-webhook-transport-ts)]((https://www.npmjs.com/package/winston-slack-webhook-transport-ts))

## Installation

```
npm install winston winston-slack-webhook-transport-ts
```

## Usage

### Set up with transports

```typescript
import * as winston from 'winston';
import httpsProxyAgent from 'https-proxy-agent';
import {
  SlackTransport,
  TransformableInfo,
} from 'winston-slack-webhook-transport-ts';

const logger = winston.createLogger({
    level: "info",
    transports: [
      new SlackTransport({
        level: 'error',
        webhookUrl: "slack webhook url",
        agent: httpsProxyAgent("sample agent url"),
        formatter: (data: TransformableInfo) => {
          return {
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text:
                          '```' +
                          `[${NODE_ENV.toUpperCase()}][${data.level.toUpperCase()}] ${
                                  data.message
                          }` +
                          '```',
                },
              },
            ],
          };
        },
      }),
    ]
});

logger.info("This should now appear on Slack");
```

### Options

* `webhookUrl` **REQUIRED** - Slack incoming webhook
  URL. [Follow steps 1 through 3 at this link to create a new webhook if you don't already have one](https://api.slack.com/messaging/webhooks).
* `formatter` - Custom function to format messages with. This function accepts the `info`
  object ([see Winston documentation](https://github.com/winstonjs/winston/blob/master/README.md#streams-objectmode-and-info-objects))
  and must return an object with at least one of the following three keys: `text` (string), `attachments` (array
  of [attachment objects](https://api.slack.com/messaging/composing/layouts#attachments)), `blocks` (array
  of [layout block objects](https://api.slack.com/messaging/composing/layouts#adding-blocks)). These will be used to
  structure the format of the logged Slack message. By default, messages will use the format of `[level]: [message]`
  with no attachments or layout blocks. A value of `false` can also be returned to prevent a message from being sent to
  Slack.
* `level` - Level to log. Global settings will apply if left undefined.
* `unfurlLinks` - Enables or
  disables [link unfurling.](https://api.slack.com/reference/messaging/link-unfurling#no_unfurling_please) (
  Default: `false`)
* `unfurlMedia` - Enables or
  disables [media unfurling.](https://api.slack.com/reference/messaging/link-unfurling#no_unfurling_please) (
  Default: `false`)
* `mrkdwn` - Enables or disables [`mrkdwn` formatting](https://api.slack.com/reference/surfaces/formatting#basics)
  within attachments or layout blocks (Default: `false`)
* `proxy` - Allows specifying a proxy server
  that [gets passed directly down to Axios](https://github.com/axios/axios#request-config) (Default: `undefined`)
* `channel` - Overrides the webhook's default channel. This should be a channel ID. (Default: `undefined`)
* `username` - Overrides the webhook's default username. (Default: `undefined`)
* `iconEmoji` - An [emoji code string](https://www.webpagefx.com/tools/emoji-cheat-sheet/) to use in place of the
  default icon. (Interchangeable with `iconUrl`) (Default: `undefined`)
* `iconUrl` - An icon image URL string to use in place of the default icon. Interchangeable with `iconEmoji`. (
  Default: `undefined`)
* `agent` - An HttpAgent Instance. If you use httpsProxyAgent with`import httpsProxyAgent from 'https-proxy-agent'`, It will automatically enable proxy setting;


### Message formatting

`winston-slack-webhook-transport-ts` supports the ability to format messages using Slack's message layout features. To
do this, supply a custom formatter function that returns
the [requisite object structure](https://api.slack.com/messaging/composing/layouts) to create the desired layout. You
can use the [Slack Block Kit Builder](https://app.slack.com/block-kit-builder/) to quickly and easily prototype advanced
layouts using Block Kit.

If for some reason you don't want to send a message to Slack, you can also return `false` to prevent the log message
from being sent.

Formatters can also override the channel the message is posted to, username, and icon by defining the
properties `channel`, `username`, `iconEmoji`, or `iconUrl` in the same object structure. These will override any
options set in the transport constructor.

Note that if you're using Block Kit using either the `attachments` or `blocks` keys, the `text` parameter will function
as a fallback for surfaces that do not support Block Kit, such as push notifications. It is recommended to
include `text` when possible in these cases.

```typescript
import * as winston from 'winston';
import httpsProxyAgent from 'https-proxy-agent';
import {
  Index,
  TransformableInfo,
} from 'winston-slack-webhook-transport-ts';

const logger = winston.createLogger({
    level: "info",
    transports: [
        new Index({
            webhookUrl: "https://hooks.slack.com/services/xxx/xxx/xxx",
            formatter: info => {
                return {
                    text: "This will function as a fallback for surfaces that don't support Block Kit, like IRC clients or mobile push notifications.",
                    attachments: [
                        {
                            text: "Or don't pass anything. That's fine too"
                        }
                    ],
                    blocks: [
                        {
                            type: "section",
                            text: {
                                type: "plain_text",
                                text: "You can pass more info to the formatter by supplying additional parameters in the logger call"
                            }
                        }
                    ]
                }
            }
        })
    ]
});

logger.info("Definitely try playing around with this.");
```