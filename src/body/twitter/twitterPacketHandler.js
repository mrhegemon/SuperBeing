import { postgres } from "../postgres.js"

export class twitterPacketHandler {
    static getInstance
    twitter
    twitterV1
    localUser

    constructor(twitter, twitterV1, localUser) {
        twitterPacketHandler.getInstance = this
        this.twitter = twitter
        this.twitterV1 = twitterV1
        this.localUser = localUser
    }
    
    async handleMessage(responses, messageId, chat_id, args) {
        Object.keys(responses).map(async function(key, index) {
            if (args === 'DM') {
                const dmSent = await twitterPacketHandler.getInstance.twitterV1.v1.sendDm({
                    recipient_id: chat_id,
                    text: responses[key]
                })
                postgres.getInstance.addMessageInHistory('twitter', chat_id, dmSent.event.id, process.env.BOT_NAME, responses[key])
            } else if (args === 'Twit') {
                await twitterPacketHandler.getInstance.twitterV1.v1.reply(responses[key], chat_id).then(res => {
                    postgres.getInstance.addMessageInHistory('twitter', chat_id, res.id_str, process.env.BOT_NAME, responses[key])
                })
            }
        })
    }
}