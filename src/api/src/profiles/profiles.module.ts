import { Module } from '@nestjs/common'
import { ProfilesService } from './profiles.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Profile } from '@miklebel/watchdog-core'

@Module({
  providers: [ProfilesService],
  imports: [TypeOrmModule.forFeature([Profile])],
  exports: [ProfilesService]
})
export class ProfilesModule {}
