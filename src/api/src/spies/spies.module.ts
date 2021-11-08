import { Module } from '@nestjs/common'
import { SpiesService } from './spies.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Profile, Spy, User } from '@miklebel/watchdog-core'

@Module({
  providers: [SpiesService],
  imports: [TypeOrmModule.forFeature([Spy, Profile, User])],
  exports: [SpiesService]
})
export class SpiesModule {}
