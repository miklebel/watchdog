import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcrypt'
import { User, CreateUserDTO } from '@miklebel/watchdog-core'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findByUsername(username)
    if (user) {
      const { hash } = user
      const validated = await this.compareHash(password, hash)
      if (validated) return user
      return null
    }
    return null
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload)
    }
  }

  async createUser(userDTO: CreateUserDTO): Promise<User> {
    const { password, role, username } = userDTO
    const hash = await this.generateHash(password)
    return this.usersService.createUser(username, hash, role)
  }

  private async generateHash(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  private async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}
