import { Controller, Get, Req, Post, UseGuards, Body, Request } from '@nestjs/common'
import { AppService } from './app.service'
import { AuthService } from './auth/auth.service'
import { LocalAuthGuard } from './auth/local.authguard'
import { CreateUserDTO } from '@miklebel/watchdog-core'
import { JwtAuthGuard } from './auth/jwt.authguard'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Req() req) {
    return this.authService.login(req.user)
  }

  @Post('auth/register')
  async register(@Body() body: CreateUserDTO) {
    const newUser = this.authService.createUser(body)
    return newUser
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/profile')
  getProfile(@Request() req) {
    return req.user
  }
}
