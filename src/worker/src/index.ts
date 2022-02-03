import 'reflect-metadata'
import { createContainer } from './container'
import { createProfilerQueue } from './queues/profiler'
import { createTweetQueue } from './queues/tweet'

const main = async () => {
  await createContainer()

  createProfilerQueue()
  createTweetQueue()
}

main()
