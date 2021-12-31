import 'reflect-metadata'
import { createContainer } from './container'
import { createProfilerQueue } from './queues/profiler'
import { createTweetQueue } from './queues/tweet'
import { createProfilerScheduler } from './schedulers/profiler'
import { createTweetScheduler } from './schedulers/tweets'

const main = async () => {
  const container = await createContainer()

  // createProfilerScheduler()
  // createProfilerQueue()
  createTweetScheduler()
  createTweetQueue()
}

main()
