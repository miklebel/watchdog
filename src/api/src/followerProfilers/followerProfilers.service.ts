import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, FindOneOptions, Repository } from 'typeorm'
import {
  FollowerProfiler,
  FollowerProfilerListRequestDTO,
  UserDTO,
  CreateOrUpdateFollowerProfilerDTO
} from '@miklebel/watchdog-core'
import { ProfilesService } from '../profiles/profiles.service'
import { UsersService } from '../users/users.service'

@Injectable()
export class FollowerProfilerService {
  constructor(
    @InjectRepository(FollowerProfiler)
    private followerProfilerRepository: Repository<FollowerProfiler>,
    private profilesService: ProfilesService,
    private usersService: UsersService
  ) {}

  findAll(): Promise<FollowerProfiler[]> {
    return this.followerProfilerRepository.find()
  }

  findOne(id: string, options?: FindOneOptions<FollowerProfiler>): Promise<FollowerProfiler> {
    return this.followerProfilerRepository.findOne(id, options)
  }

  async findByOwner(
    user: UserDTO,
    options: FollowerProfilerListRequestDTO
  ): Promise<[FollowerProfiler[], number]> {
    const {
      limit,
      offset,
      order: { ascending, column }
    } = options

    return this.followerProfilerRepository.findAndCount({
      where: { user: { id: user.id } },
      order: {
        [column]: ascending ? 'ASC' : 'DESC'
      },
      relations: ['profile'],
      take: limit,
      skip: offset
    })
  }

  async createOrUpdate(
    createOrUpdateFollowerProfilerDTO: CreateOrUpdateFollowerProfilerDTO,
    user: UserDTO
  ): Promise<FollowerProfiler> {
    const followerProfiler = this.followerProfilerRepository.create()

    const filteredProfileName = createOrUpdateFollowerProfilerDTO.profileName.replace('@', '')

    const [createdProfiles, foundUser] = await Promise.all([
      this.profilesService.createProfiles([filteredProfileName]),
      this.usersService.findOne(user.id)
    ])

    followerProfiler.id = createOrUpdateFollowerProfilerDTO.id
    followerProfiler.name = createOrUpdateFollowerProfilerDTO.name
    followerProfiler.profile = createdProfiles[0]
    followerProfiler.status = createOrUpdateFollowerProfilerDTO.status
    followerProfiler.user = foundUser

    return this.followerProfilerRepository.save(followerProfiler)
  }

  async remove(id: number, user: UserDTO): Promise<DeleteResult> {
    return await this.followerProfilerRepository.delete({ user: { id: user.id }, id })
  }
}
