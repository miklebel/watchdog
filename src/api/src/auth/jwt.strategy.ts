import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { jwtConstants } from './constants/secret'
import { UsersService } from '../users/users.service'
import { UserDTO } from '@miklebel/watchdog-core'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret
    })
  }

  async validate(payload: any): Promise<UserDTO> {
    return (
      await this.usersService.findOne(payload.sub, { select: ['role', 'username', 'id'] })
    ).publicDTO()
  }
}
