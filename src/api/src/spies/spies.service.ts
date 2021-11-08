import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOneOptions, Repository } from 'typeorm'
import { CreateSpyDTO, Profile, Spy, User, UserDTO } from '@miklebel/watchdog-core'
import { ProfilesService } from '../profiles/profiles.service'
import { UsersService } from '../users/users.service'

@Injectable()
export class SpiesService {
  constructor(
    @InjectRepository(Spy)
    private spiesRepository: Repository<Spy>,
    @InjectRepository(Profile)
    private profilesService: ProfilesService,
    @InjectRepository(User)
    private usersService: UsersService
  ) {}

  findAll(): Promise<Spy[]> {
    return this.spiesRepository.find()
  }

  findOne(id: string, options?: FindOneOptions<Spy>): Promise<Spy> {
    return this.spiesRepository.findOne(id, options)
  }

  findByOwner(username: string): Promise<Spy> {
    return this.spiesRepository.findOne({ where: { user: { username } } })
  }

  async createSpy(createSpyDTO: CreateSpyDTO, user: UserDTO): Promise<Spy> {
    const spy = this.spiesRepository.create()
    spy.name = createSpyDTO.name
    spy.profiles = await this.profilesService.createProfiles(createSpyDTO.profileNames)
    spy.scrapingRateMaximum = createSpyDTO.scrapingRateMaximum
    spy.scrapingRateMinimum = createSpyDTO.scrapingRateMinimum
    spy.status = createSpyDTO.status
    spy.user = await this.usersService.findOne(user.id)

    return this.spiesRepository.save(spy)
  }

  async remove(id: string): Promise<void> {
    await this.spiesRepository.delete(id)
  }
}
