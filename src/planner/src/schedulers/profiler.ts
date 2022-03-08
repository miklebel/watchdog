/* eslint-disable no-restricted-syntax */
import { CronJob } from 'cron'
import { container } from 'tsyringe'
import Queue from 'bull'
import { ProfilerJobDTO } from '@miklebel/watchdog-core'
import { TypeOrmRepository, TypeOrmRepositorySymbol } from '../repos/typeormRepo'

const port = process.env.REDIS_PORT ?? 6379
const ip = process.env.REDIS_IP ?? 'localhost'

const profilerQueue = new Queue('profiler', `redis://${ip}:${port}`)

export const createProfilerScheduler = (): CronJob => {
  const repository = container.resolve<TypeOrmRepository>(TypeOrmRepositorySymbol)

  const job = new CronJob(
    '0 * * * *',
    async () => {
      console.log('new job processing')
      const profiles = await repository.getActiveProfiles()
      const followerProfilerProfiles = await repository.getActiveFollowerProfilersProfiles()

      for (const profile of [...profiles, ...followerProfilerProfiles]) {
        const profileDTO = repository.profileToDTO(profile)
        const jobData: ProfilerJobDTO = { profile: profileDTO }
        profilerQueue.add(jobData)
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
