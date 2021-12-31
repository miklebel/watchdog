/* eslint-disable no-restricted-syntax */
import { CronJob } from 'cron'
import { container } from 'tsyringe'
import { ProfilerJobDTO } from '@miklebel/watchdog-core'
import { TypeOrmRepository, TypeOrmRepositorySymbol } from '../repos/typeormRepo'
import { profilerQueue } from '../queues/profiler'

export const createProfilerScheduler = (): CronJob => {
  const repository = container.resolve<TypeOrmRepository>(TypeOrmRepositorySymbol)
  const job = new CronJob(
    '30,0 * * * *',
    async () => {
      console.log('new job processing')
      const profiles = await repository.getActiveProfiles()
      for (const profile of profiles) {
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
