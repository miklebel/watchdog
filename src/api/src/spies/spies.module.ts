import { Module } from '@nestjs/common'
import { SpiesService } from './spies.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Profile, Spy, User } from '@miklebel/watchdog-core'
import { ProfilesModule } from '../profiles/profiles.module'
import { UsersModule } from '../users/users.module'

@Module({
  providers: [SpiesService],
  imports: [TypeOrmModule.forFeature([Spy, Profile, User]), ProfilesModule, UsersModule],
  exports: [SpiesService]
})
export class SpiesModule {}
