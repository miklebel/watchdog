import 'reflect-metadata'
import { createContainer } from './container'
import { createProfilerQueue } from './queues/profiler'
import { createProfilerScheduler } from './schedulers/profiler'

const main = async () => {
  const container = await createContainer()

  createProfilerScheduler()
  createProfilerQueue()
}

main()
