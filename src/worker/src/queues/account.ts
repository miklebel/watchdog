/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-destructuring */
import {
  TweetJobDTO,
  ClickhouseTable,
  ClickhouseRepository,
  ClickhouseRepositorySymbol
} from '@miklebel/watchdog-core'
import Queue from 'bull'
import { container } from 'tsyringe'
import { TweetScraper } from '../scraper/TweetScraper'

const port = process.env.REDIS_PORT ?? 6379
const ip = process.env.REDIS_IP ?? 'localhost'

export const accountQueue = new Queue('account', `redis://${ip}:${port}`)

export const createAccountQueue = () => {
  accountQueue.process(async (job, done) => {
    const clickhouseRepository = container.resolve<ClickhouseRepository>(ClickhouseRepositorySymbol)

    const tweet: TweetJobDTO = job.data.tweet

    try {
      const scraper = await TweetScraper.init(tweet)
      const { likes, quotes, retweets } = await scraper.parseTweet()

      clickhouseRepository.insert({
        table: ClickhouseTable.tweets_stats,
        row: { ...tweet, likes, quotes, retweets, date: Date.now() / 1000, time: Date.now() / 1000 }
      })

      await scraper.close()
      done()
    } catch (error) {
      console.log(error)
      done(error)
    }
  })
  return accountQueue
}
