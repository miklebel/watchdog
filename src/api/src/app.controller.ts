import { Controller, Get, Req, Post, UseGuards, Body, Request, Put } from '@nestjs/common'
import { AppService } from './app.service'
import { AuthService } from './auth/auth.service'
import { LocalAuthGuard } from './auth/local.authguard'
import {
  CreateUserDTO,
  UserDTO,
  CreateSpyDTO,
  SpyListRequestDTO,
  SpyDTO,
  SpyListResponseDTO
} from '@miklebel/watchdog-core'
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
  async createSpy(
    @Body() body: CreateSpyDTO,
    @Request() req: { user: UserDTO }
  ): Promise<CreateSpyDTO> {
    const spy = await this.spiesService.create(body, req.user)

    const dto = new CreateSpyDTO()

    dto.name = spy.name
    dto.profileNames = spy.profiles.map(profile => profile.username)
    dto.scrapingRateMaximum = spy.scrapingRateMaximum
    dto.scrapingRateMinimum = spy.scrapingRateMinimum
    dto.status = spy.status

    return dto
  }

  @UseGuards(JwtAuthGuard)
  @Post('spy/list')
  async getSpyList(
    @Body() body: SpyListRequestDTO,
    @Request() req: { user: UserDTO }
  ): Promise<SpyListResponseDTO> {
    const [spies, count] = await this.spiesService.findByOwner(req.user, body)

    const rows: SpyDTO[] = spies.map(spy => {
      const { id, name, profiles, scrapingRateMaximum, scrapingRateMinimum, status } = spy
      const profileNames = profiles.map(profile => profile.username)
      return { id, name, profileNames, scrapingRateMaximum, scrapingRateMinimum, status }
    })
    return { rows, count }
  }
}
