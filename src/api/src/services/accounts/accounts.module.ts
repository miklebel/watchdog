import { Module } from '@nestjs/common'
import { AccountsService } from './accounts.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Account } from '@miklebel/watchdog-core'
import { UsersModule } from '../users/users.module'

@Module({
  providers: [AccountsService],
  imports: [TypeOrmModule.forFeature([Account]), UsersModule],
  exports: [AccountsService]
})
export class AccountsModule {}
