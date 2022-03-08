/* eslint-disable class-methods-use-this */
import { Connection, createConnection, Repository } from 'typeorm'
import {
  FollowerProfilerStatus,
  Profile,
  ProfileDTO,
  Spy,
  SpyDTO,
  SpyStatus,
  User
} from '@miklebel/watchdog-core'

export const TypeOrmRepositorySymbol = Symbol('TypeOrmRepositorySymbol')

export class TypeOrmRepository {
  private profilesRepository: Repository<Profile>

  private spiesRepository: Repository<Spy>

  constructor(establishedConnection: Connection) {
    this.profilesRepository = establishedConnection.getRepository(Profile)
    this.spiesRepository = establishedConnection.getRepository(Spy)
  }

  public static async init() {
    const connection = await createConnection({
      type: 'postgres',
      host: process.env.POSTGRES_IP ?? 'localhost',
      port: +process.env.POSTGRES_PORT ?? 6379,
      username: process.env.POSTGRES_USERNAME || 'watchdog',
      password: process.env.POSTGRES_PASSWORD || 'watchdog',
      database: process.env.POSTGRES_DATABASE || 'watchdog',
      entities: [Profile, Spy, User],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: false,
      migrationsTableName: 'migrations',
      cli: {
        migrationsDir: 'migration'
      }
    })
    console.log('Connected TypeORM database.')

    return new TypeOrmRepository(connection)
  }

  private async getActiveSpies() {
    const activeSpies = await this.spiesRepository.find({
      where: {
        status: SpyStatus.ENABLED
      },
      relations: ['profiles']
    })

    return activeSpies
  }

  public async getActiveProfiles(profiles?: string[]): Promise<Profile[]> {
    const query = this.profilesRepository.createQueryBuilder('profile')

    if (profiles && profiles.length) {
      query.where(`profile.username ~* '${profiles.join('|')}'`)
    }
    query.innerJoinAndSelect('profile.spies', 'spy', 'spy.status = :status', {
      status: SpyStatus.ENABLED
    })
    const activeProfiles = await query.getMany()
    return activeProfiles
  }

  public async getActiveFollowerProfilersProfiles(profiles?: string[]): Promise<Profile[]> {
    const query = this.profilesRepository.createQueryBuilder('profile')

    if (profiles && profiles.length) {
      query.where(`profile.username ~* '${profiles.join('|')}'`)
    }
    query.innerJoinAndSelect(
      'profile.followerProfilers',
      'followerProfiler',
      'followerProfiler.status = :status',
      {
        status: FollowerProfilerStatus.ENABLED
      }
    )
    const activeProfiles = await query.getMany()
    return activeProfiles
  }

  public profileToDTO(profile: Profile): ProfileDTO {
    const { created, updated, username } = profile
    return { username, updated, created }
  }

  public spyToDTO(spy: Spy): SpyDTO {
    const {
      created,
      updated,
      id,
      name,
      profiles,
      scrapingRateMaximum,
      scrapingRateMinimum,
      status
    } = spy

    const profileNames = profiles.map(profile => profile.username)

    return {
      created,
      status,
      updated,
      scrapingRateMaximum,
      scrapingRateMinimum,
      name,
      id,
      profileNames
    }
  }
}
