import { User, UserRole } from '@miklebel/watchdog-core'
import { IsNotEmpty, IsAlpha, IsEnum } from 'class-validator'

export class CreateUserDto {
  @IsAlpha()
  username: string

  @IsNotEmpty()
  password: string

  @IsEnum(UserRole)
  role: UserRole
}
