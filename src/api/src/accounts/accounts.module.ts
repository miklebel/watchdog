import { Module } from '@nestjs/common'
import { AccountsService } from './accounts.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Account, Profile, Spy, User } from '@miklebel/watchdog-core'
import { ProfilesModule } from '../profiles/profiles.module'
import { UsersModule } from '../users/users.module'

@Module({
  providers: [AccountsService],
  imports: [TypeOrmModule.forFeature([Account]), UsersModule],
  exports: [AccountsService]
})
export class AccountsModule {}
