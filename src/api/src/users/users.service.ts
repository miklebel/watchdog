import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOneOptions, Repository } from 'typeorm'
import { User, UserRole } from '@miklebel/watchdog-core'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find()
  }

  findOne(id: string, options?: FindOneOptions<User>): Promise<User> {
    return this.usersRepository.findOne(id, options)
  }

  findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } })
  }

  async createUser(username: string, hash: string, role: UserRole): Promise<User> {
    const user = this.usersRepository.create()
    user.username = username
    user.hash = hash
    user.role = role
    return this.usersRepository.save(user)
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id)
  }
}
