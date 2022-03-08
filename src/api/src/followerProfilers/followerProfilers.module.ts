import { Module } from '@nestjs/common'
import { FollowerProfilerService } from './followerProfilers.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Profile, FollowerProfiler, User } from '@miklebel/watchdog-core'
import { ProfilesModule } from '../profiles/profiles.module'
import { UsersModule } from '../users/users.module'

@Module({
  providers: [FollowerProfilerService],
  imports: [
    TypeOrmModule.forFeature([FollowerProfiler, Profile, User]),
    ProfilesModule,
    UsersModule
  ],
  exports: [FollowerProfilerService]
})
export class FollowerProfilersModule {}
