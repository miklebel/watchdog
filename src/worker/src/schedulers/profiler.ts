/* eslint-disable no-restricted-syntax */
import { CronJob } from 'cron'
import { container } from 'tsyringe'
import { TypeOrmRepository, TypeOrmRepositorySymbol } from '../repos/typeormRepo'
import { profilerQueue } from '../queues/profiler'
import { ProfilerJobDTO } from '../queues/dto/profilerJobDTO'

export const createProfilerScheduler = (): CronJob => {
  const repository = container.resolve<TypeOrmRepository>(TypeOrmRepositorySymbol)
  const job = new CronJob(
    '0 0-23 * * *',
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
