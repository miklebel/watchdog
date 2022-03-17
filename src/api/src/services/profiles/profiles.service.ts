import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOneOptions, Repository, FindManyOptions } from 'typeorm'
import { Profile, Spy, UserDTO } from '@miklebel/watchdog-core'

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile> // @InjectRepository(Spy) // private spiesRepository: Repository<Spy>
  ) {}

  findAll(): Promise<Profile[]> {
    return this.profilesRepository.find()
  }

  findOne(id: string, options?: FindOneOptions<Profile>): Promise<Profile> {
    return this.profilesRepository.findOne(id, options)
  }

  public async createProfiles(usernames: string[]): Promise<Profile[]> {
    const profiles = usernames.map(username => {
      const profile = new Profile()
      profile.username = username
      return profile
    })

    return this.profilesRepository.save(profiles)
  }

  public async findProfiles(
    user: UserDTO,
    where?: { username?: string; spyId?: string },
    options?: FindManyOptions<Profile>
  ) {
    const query = this.profilesRepository.createQueryBuilder('profile')
    if (where?.username)
      query.where('profile.username ILIKE :username', { username: `%${where.username}%` })
    query.innerJoinAndSelect(
      'profile.spies',
      'spy',
      `spy.user.id = :userId ${where?.spyId ? `AND spy.id = :spyId` : ''}`,
      {
        userId: user.id,
        spyId: where?.spyId
      }
    )

    query.orderBy('profile.username', 'ASC')

    query.limit(options?.take ?? 10)
    if (options?.skip) query.skip(options.skip)

    const [count, rows] = await Promise.all([query.getCount(), query.getMany()])

    return { count, rows }
  }
}
