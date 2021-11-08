import { Controller, Get, Req, Post, UseGuards, Body, Request, Put } from '@nestjs/common'
import { AppService } from './app.service'
import { AuthService } from './auth/auth.service'
import { LocalAuthGuard } from './auth/local.authguard'
import { CreateUserDTO, UserDTO, CreateSpyDTO } from '@miklebel/watchdog-core'
import { JwtAuthGuard } from './auth/jwt.authguard'
import { SpiesService } from './spies/spies.service'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly spiesService: SpiesService
  ) {}

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
  async register(@Body() body: CreateUserDTO): Promise<UserDTO> {
    const newUser = this.authService.createUser(body)
    return (await newUser).publicDTO()
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/profile')
  getProfile(@Request() req: { user: UserDTO }): UserDTO {
    return req.user
  }

  @UseGuards(JwtAuthGuard)
  @Post('spy/create')
  async createSpy(@Body() body: CreateSpyDTO, @Request() req: { user: UserDTO }) {
    const spy = await this.spiesService.createSpy(body, req.user)

    return spy
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('spy/create')
  // createSpy(@Body() body: )
}
