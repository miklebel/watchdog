import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOneOptions, Repository } from 'typeorm'
import { Profile } from '@miklebel/watchdog-core'

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>
  ) {}

  findAll(): Promise<Profile[]> {
    return this.profilesRepository.find()
  }

  findOne(id: string, options?: FindOneOptions<Profile>): Promise<Profile> {
    return this.profilesRepository.findOne(id, options)
  }

  async createProfiles(usernames: string[]): Promise<Profile[]> {
    const profiles = usernames.map(username => {
      const profile = new Profile()
      profile.username = username
      return profile
    })

    return this.profilesRepository.save(profiles)
  }
}
