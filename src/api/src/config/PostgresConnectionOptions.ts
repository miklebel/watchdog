import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { User } from '../entity/User'

const options: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: +(process.env.POSTGRES_PORT || 5432),
  username: process.env.POSTGRES_USERNAME || 'watchdog',
  password: process.env.POSTGRES_PASSWORD || 'watchdog',
  database: process.env.POSTGRES_DATABASE || 'watchdog',
  schema: process.env.POSTGRES_SCHEMA || 'internal',
  synchronize: true,
  logging: false,
  migrationsRun: true,
  migrationsTableName: 'migrations',
  migrations: [`${__dirname}/../infra/migrations/*.ts`, `${__dirname}/../infra/migrations/*.js`],
  cli: {
    migrationsDir: 'src/infra/migrations'
  },
  entities: [User]
}

export = options
