import { User, Spy, Profile, FollowerProfiler, Account } from '@miklebel/watchdog-core'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const createConfig = (): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: +(process.env.POSTGRES_PORT || 5432),
    username: process.env.POSTGRES_USERNAME || 'watchdog',
    password: process.env.POSTGRES_PASSWORD || 'watchdog',
    database: process.env.POSTGRES_DATABASE || 'watchdog',
    entities: [User, Spy, Profile, FollowerProfiler, Account],
    synchronize: process.env.NODE_ENV === 'production' ? false : true,
    logging: false,
    migrationsTableName: 'migrations',
    cli: {
      migrationsDir: `${__dirname}/../typeorm/migrations`
    },
    migrations: [`${__dirname}/../src/typeorm/migrations/*.ts`]
  }
}
