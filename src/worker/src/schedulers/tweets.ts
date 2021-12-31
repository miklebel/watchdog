/* eslint-disable no-restricted-syntax */
import { CronJob } from 'cron'
import { container } from 'tsyringe'
import { tweetQueue } from '../queues/tweet'
import { ClickhouseRepository, ClickhouseRepositorySymbol } from '../repos/clickhouseRepo'

export const createTweetScheduler = (): CronJob => {
  const repository = container.resolve<ClickhouseRepository>(ClickhouseRepositorySymbol)
  const job = new CronJob(
    '30,0 * * * *',
    async () => {
      console.log('new job processing')
      const tweets = await repository.selectTweetScraper()
      console.log(tweets[0])
      for (const tweet of tweets) {
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
