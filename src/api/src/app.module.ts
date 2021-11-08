import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User, Spy, Profile } from '@miklebel/watchdog-core'
import { SpiesModule } from './spies/spies.module'

@Module({
  imports: [
    AuthModule,
    UsersModule,
    SpiesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.POSTGRES_USERNAME || 'watchdog',
      password: process.env.POSTGRES_PASSWORD || 'watchdog',
      database: process.env.POSTGRES_DATABASE || 'watchdog',
      entities: [User, Spy, Profile],
      synchronize: process.env.NODE_ENV === 'production' ? false : true,
      logging: false,
      migrationsTableName: 'migrations'
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
