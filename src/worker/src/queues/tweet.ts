/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-destructuring */
import { TweetJobDTO } from '@miklebel/watchdog-core'
import Queue from 'bull'
import { container } from 'tsyringe'
import { ClickhouseTable } from '../repos/clickhouse/enums'
import { ClickhouseRepository, ClickhouseRepositorySymbol } from '../repos/clickhouseRepo'
import { TweetScraper } from '../scraper/TweetScraper'

const port = process.env.REDIS_PORT ?? 6379
const ip = process.env.REDIS_IP ?? 'localhost'

export const tweetQueue = new Queue('tweet', `redis://${ip}:${port}`)

export const createTweetQueue = () => {
  tweetQueue.process(async (job, done) => {
    const clickhouseRepository = container.resolve<ClickhouseRepository>(ClickhouseRepositorySymbol)

    const tweet: TweetJobDTO = job.data.tweet
    console.log(tweet)

    const scraper = await TweetScraper.init(tweet)
    const { likes, quotes, retweets } = await scraper.parseTweet()

    clickhouseRepository.insert({
      table: ClickhouseTable.tweets_stats,
      row: { ...tweet, likes, quotes, retweets, date: Date.now() / 1000, time: Date.now() / 1000 }
    })

    await scraper.close()
    done()
  })
  return tweetQueue
}
