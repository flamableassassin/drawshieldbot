# DrawShield bot

This is a discord bot used to interact with [drawshield.net](https://drawshield.net). After implementing some command for a private bot I run an maintain I saw that the original bot that was given as an example was old and used some interesting [techniques](https://gist.github.com/karlwilcox/f7c08f30b83000cc49f41358c47810f6#file-drawshield-js-L86-L97)

## Deployment

This bot is built on top of [cloudflare workers](https://workers.cloudflare.com) so that the bot can scale as well as make it easier for other people to setup the bot themselves.

## Development

When developing this bot I used [cloudflare quick tunnels](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/do-more-with-tunnels/trycloudflare) to make my life easier you can use other services such as [ngrok](https://ngrok.com) however I haven't used them before. When using cloudflare tunnels run the command `cloudflared tunnel -url=localhost:8787` this will give you a url which will be used for discord.

As well as to create a `.dev.vars` file from `example.dev.vars` and replace `0123456789` with your discord application public key

Throughout the source code you will find me using timeouts in order to send attachments. This is due to me struggling to workout how I can response to an interaction with `multipart/form-data` as a response content type. As at the current point in time discord own docs doesn't seem to mention anything about doing this and this way works.

### Built using:

- https://github.com/drawshield/Drawshield-Code _and the Github wiki_
- https://drawshield.net/resources/reference-api.html
- https://gist.github.com/karlwilcox/f7c08f30b83000cc49f41358c47810f6
- Time spent reverse engineering parts of the website
- Time spent searching on the discord server to see how people use the bot in there
