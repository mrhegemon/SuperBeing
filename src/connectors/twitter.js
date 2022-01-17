import { TwitterApi } from 'twitter-api-v2';
import { database } from '../database/database.js';
import customConfig from '../utilities/customConfig.js';

export class twitterPacketHandler {
    static instance
    twitter
    twitterV1
    localUser

    constructor(twitter, twitterV1, localUser) {
        twitterPacketHandler.instance = this
        this.twitter = twitter
        this.twitterV1 = twitterV1
        this.localUser = localUser
    }
    
    async handleMessage(responses, messageId, chat_id, args) {
        Object.keys(responses).map(async function(key, index) {
            if (args === 'DM') {
                const dmSent = await twitterPacketHandler.instance.twitterV1.v1.sendDm({
                    recipient_id: chat_id,
                    text: responses[key]
                })
                database.instance.addMessageInHistory('twitter', chat_id, dmSent.event.id, customConfig.instance.get('botName'), responses[key])
            } else if (args === 'Twit') {
                await twitterPacketHandler.instance.twitterV1.v1.reply(responses[key], chat_id).then(res => {
                    database.instance.addMessageInHistory('twitter', chat_id, res.id_str, customConfig.instance.get('botName'), responses[key])
                })
            }
        })
    }
}

export const createTwitterClient = async () => {
    const bearerToken = customConfig.instance.get('twitterBearerToken')
    const twitterUser = customConfig.instance.get('twitterID')
    const twitterAppToken = customConfig.instance.get('twitterAppToken')
    const twitterAppTokenSecret = customConfig.instance.get('twitterAppTokenSecret')
    const twitterAccessToken = customConfig.instance.get('tiwtterAccessToken')
    const twitterAccessTokenSecret = customConfig.instance.get('twitterAccessTokenSecret')
    const regex = new RegExp('', 'ig')
    const regex2 = new RegExp(customConfig.instance.get('botNameRegex'), 'ig')
    if (!bearerToken || !twitterUser) return console.warn("No API token for Whatsapp bot, skipping");

    let twitter = new TwitterApi(bearerToken) 
    let twitterV1 = new TwitterApi({
        appKey: twitterAppToken,
        appSecret: twitterAppTokenSecret,
        accessToken: twitterAccessToken,
        accessSecret: twitterAccessTokenSecret,
      });
    const client = twitter.readWrite
    const localUser = await twitter.v2.userByUsername(twitterUser)

    new twitterPacketHandler( new TwitterApi(bearerToken), new TwitterApi({
        appKey: twitterAppToken,
        appSecret: twitterAppTokenSecret,
        accessToken: twitterAccessToken,
        accessSecret: twitterAccessTokenSecret,
      }), 
      localUser)

    setInterval(async () => {
        const tv1 = new TwitterApi({
            appKey: twitterAppToken,
            appSecret: twitterAppTokenSecret,
            accessToken: twitterAccessToken,
            accessSecret: twitterAccessTokenSecret,
          });
        const eventsPaginator = await tv1.v1.listDmEvents()
        for await (const event of eventsPaginator) {
            
            console.log('Event: ' + JSON.stringify(event.message_create.message_data.text))
            if (event.type == 'message_create') {

                console.log('isMessage')
                if (event.message_create.sender_id == localUser.data.id) { console.log('same sender'); return }

                let authorName = 'unknown'
                const author = await twitter.v2.user(event.message_create.sender_id)
                if (author) authorName = author.data.username

                await database.instance.messageExistsAsyncWitHCallback2('twitter', event.message_create.target.recipient_id, event.id, authorName, event.message_create.message_data.text, parseInt(event.created_timestamp), () => {
                    // TODO: Replace me with direction message handler
                    // MessageClient.instance.sendMessage(event.message_create.message_data.text,
                    //     event.id,
                    //     'twitter',
                    //     author.data.id,
                    //     event.created_timestamp,
                    //     false,
                    //     authorName,
                    //     'DM')

                    database.instance.addMessageInHistoryWithDate(
                        'twitter',
                        event.message_create.target.recipient_id,
                        event.id,
                        authorName,
                        event.message_create.message_data.text,
                        event.created_timestamp)
                })

            }
        }
    }, 25000)

    
    /*const rules = await client.v2.streamRules()
    if (rules.data?.length) {
        await client.v2.updateStreamRules({
            delete: { ids: rules.data.map(rule => rule.id) },
        })
    }

    const tweetRules = process.env.TWITTER_TWEET_RULES.split(',')
    const _rules = []
    for (let x in tweetRules) {
        console.log('rule: ' + tweetRules[x])
        _rules.push({value: tweetRules[x]})
    }

    await client.v2.updateStreamRules({
        add: _rules
    })

    const stream = await client.v2.searchStream({
        "tweet.fields": ['referenced_tweets', 'author_id'],
        expansions: ['referenced_tweets.id']
    })
    stream.autoReconnect = true

    stream.on(ETwitterStreamEvent.Data, async twit => {
        const isARt = twit.data.referenced_tweets?.some(twit => twit.type === 'retweeted') ?? false
        if (isARt || (localUser !== undefined && twit.data.author_id == localUser.data.id)) {
            console.log('isArt found')
        } else {
            if (/*!twit.data.text.match(regex) && *//*!twit.data.text.match(regex2)) {  
             /*   console.log('regex doesnt match')
            } else {
                let authorName = 'unknown'
                const author = await twitter.v2.user(twit.data.author_id)
                if (author) authorName = author.data.username

                let date = new Date();
                if (twit.data.created_at) date = new Date(twit.data.created_at)
                const utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
                const utcStr = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + utc.getHours() + ':' + utc.getMinutes() + ':' + utc.getSeconds()
                var ts = Math.floor(utc.getTime() / 1000);

                await database.instance.messageExistsAsyncWitHCallback2('reddit', twit.data.id, twit.data.id, authorName, twit.data.text, ts, () => {
                    MessageClient.instance.sendMessage(twit.data.text, 
                        twit.data.id,
                        'twitter',
                        twit.data.in_reply_to_user_id ? twit.data.in_reply_to_user_id : twit.data.id,
                        ts + '',
                        false,
                        authorName,
                        'Twit')
                        console.log('sending twit: ' + JSON.stringify(twit))

                    
                    
                    database.instance.addMessageInHistoryWithDate(
                        'twitter',
                        twit.data.id,
                        twit.data.id,
                        authorName,
                        twit.data.text,
                        utcStr)
                })
            }
        }
    })*/
    

}