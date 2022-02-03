import 'reflect-metadata'
import { createContainer } from './container'

import { createProfilerScheduler } from './schedulers/profiler'
import { createTweetScheduler } from './schedulers/tweets'

const main = async () => {
  await createContainer()

  createProfilerScheduler()
  createTweetScheduler()
}

main()
