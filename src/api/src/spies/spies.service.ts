import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOneOptions, Repository } from 'typeorm'
import {
  CreateOrUpdateSpyDTO,
  Profile,
  Spy,
  SpyDTO,
  SpyListRequestDTO,
  SpyListResponseDTO,
  SpyOrderColumn,
  User,
  UserDTO
} from '@miklebel/watchdog-core'
import { ProfilesService } from '../profiles/profiles.service'
import { UsersService } from '../users/users.service'

@Injectable()
export class SpiesService {
  constructor(
    @InjectRepository(Spy)
    private spiesRepository: Repository<Spy>,
    private profilesService: ProfilesService,
    private usersService: UsersService
  ) {}

  findAll(): Promise<Spy[]> {
    return this.spiesRepository.find()
  }

  findOne(id: string, options?: FindOneOptions<Spy>): Promise<Spy> {
    return this.spiesRepository.findOne(id, options)
  }

  async findByOwner(user: UserDTO, options: SpyListRequestDTO): Promise<[Spy[], number]> {
    const {
      limit,
      offset,
      order: { ascending, column }
    } = options

    return this.spiesRepository.findAndCount({
      where: { user: { id: user.id } },
      order: {
        [column]: ascending ? 'ASC' : 'DESC'
      },
      relations: ['profiles'],
      take: limit,
      skip: offset
    })
  }

  async createOrUpdate(createOrUpdateSpyDTO: CreateOrUpdateSpyDTO, user: UserDTO): Promise<Spy> {
    const spy = this.spiesRepository.create()

    const filteredProfileNames = createOrUpdateSpyDTO.profileNames
      .filter(name => name.length)
      .map(name => name.replace('@', ''))

    const [createdProfiles, foundUser] = await Promise.all([
      this.profilesService.createProfiles(filteredProfileNames),
      this.usersService.findOne(user.id)
    ])

    spy.id = createOrUpdateSpyDTO.id
    spy.name = createOrUpdateSpyDTO.name
    spy.profiles = createdProfiles
    spy.scrapingRateMaximum = createOrUpdateSpyDTO.scrapingRateMaximum
    spy.scrapingRateMinimum = createOrUpdateSpyDTO.scrapingRateMinimum
    spy.status = createOrUpdateSpyDTO.status
    spy.user = foundUser

    return this.spiesRepository.save(spy)
  }

  async remove(id: string): Promise<void> {
    await this.spiesRepository.delete(id)
  }
}
