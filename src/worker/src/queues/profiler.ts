/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-destructuring */
import Queue from 'bull'
import moment from 'moment'
import { container } from 'tsyringe'
import { ClickhouseTable, TableTweetsColumns } from '../repos/clickhouse/enums'
import { ClickhouseRepository, ClickhouseRepositorySymbol } from '../repos/clickhouseRepo'
import { ProfileScraper } from '../scraper'
import { ProfilerJobDTO } from './dto/profilerJobDTO'

const port = process.env.REDIS_PORT ?? 6379
const ip = process.env.REDIS_IP ?? 'localhost'

export const profilerQueue = new Queue('profiler', `redis://${ip}:${port}`)

export const createProfilerQueue = () => {
  profilerQueue.process(async (job, done) => {
    const clickhouseRepository = container.resolve<ClickhouseRepository>(ClickhouseRepositorySymbol)

    const data: ProfilerJobDTO = job.data
    console.log(job.data)
    const lastTweet: any[] = await clickhouseRepository.select({
      table: ClickhouseTable.tweets,
      columns: [
        TableTweetsColumns.date,
        TableTweetsColumns.username,
        TableTweetsColumns.time,
        TableTweetsColumns.id
      ],
      where: { username: [data.profile.username], date: [moment().format('YYYY-MM-DD')] },
      order: { column: TableTweetsColumns.time, direction: 'DESC' },
      limit: 1
    })

    const scraper = await ProfileScraper.init(data.profile)
    do {
      await scraper.scrollNextTweet()
      const { time, url } = await scraper.getCurrentTweetInfo()
      const id = url.split('/').pop()
      const currentTweet = {
        time: moment(time).unix(),
        id,
        username: data.profile.username
      }

      const yesterday = moment().subtract(1, 'days').startOf('day')

      if (lastTweet?.[0]?.id >= currentTweet.id || yesterday.diff(moment(time)) > 0) {
        console.log('end')
        break
      } else {
        clickhouseRepository.insert({
          table: ClickhouseTable.tweets,
          row: {
            date: currentTweet.time,
            id: currentTweet.id,
            time: currentTweet.time,
            username: currentTweet.username
          }
        })
      }
    } while (true)
    done()
  })
  return profilerQueue
}
