/* eslint-disable no-restricted-syntax */
import { CronJob } from 'cron'
import { container } from 'tsyringe'
import Queue from 'bull'
import { ClickhouseRepository, ClickhouseRepositorySymbol } from '@miklebel/watchdog-core'

import { TypeOrmRepository, TypeOrmRepositorySymbol } from '../repos/typeormRepo'

const port = process.env.REDIS_PORT ?? 6379
const ip = process.env.REDIS_IP ?? 'localhost'

const tweetQueue = new Queue('tweet', `redis://${ip}:${port}`)

export const createTweetScheduler = (): CronJob => {
  const clickhouseRepository = container.resolve<ClickhouseRepository>(ClickhouseRepositorySymbol)
  const typeOrmRepository = container.resolve<TypeOrmRepository>(TypeOrmRepositorySymbol)

  const job = new CronJob(
    '30,0 * * * *',
    async () => {
      console.log('new job processing')
      const tweets = await clickhouseRepository.selectTweetScraper()
      const activeProfiles = await typeOrmRepository.getActiveProfiles(
        tweets.map(tweet => tweet.username)
      )
      const activeTweets = tweets.filter(tweet =>
        activeProfiles
          .map(profile => profile.username.toLowerCase())
          .includes(tweet.username.toLowerCase())
      )
      for (const tweet of activeTweets) {
        const jobData = { tweet }
        tweetQueue.add(jobData)
      }
    },
    null,
    null,
    null,
    null,
    true
  )
  job.start()
  return job
}
