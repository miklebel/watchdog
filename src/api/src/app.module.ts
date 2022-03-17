import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './services/auth/auth.module'
import { UsersModule } from './services/users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SpiesModule } from './services/spies/spies.module'
import { ProfilesModule } from './services/profiles/profiles.module'
import { FollowerProfilersModule } from './services/followerProfilers/followerProfilers.module'
import { AccountsModule } from './services/accounts/accounts.module'
import { createConfig } from './config/typeorm.config'

@Module({
  imports: [
    AuthModule,
    UsersModule,
    SpiesModule,
    ProfilesModule,
    FollowerProfilersModule,
    AccountsModule,
    TypeOrmModule.forRoot(createConfig())
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
