import { Controller, Get, Req, Post, UseGuards, Body, Request, Put } from '@nestjs/common'
import { AuthService } from './auth/auth.service'
import { LocalAuthGuard } from './auth/local.authguard'
import {
  CreateUserDTO,
  UserDTO,
  CreateOrUpdateSpyDTO,
  SpyListRequestDTO,
  SpyDTO,
  SpyListResponseDTO,
  ClickhouseRepository,
  ClickhouseTable,
  TableTweetsStatsColumns,
  GetTweetsStatsListDTO
} from '@miklebel/watchdog-core'
import { JwtAuthGuard } from './auth/jwt.authguard'
import { SpiesService } from './spies/spies.service'
import { ProfilesService } from './profiles/profiles.service'

@Controller()
export class AppController {
  private clickhouseRepo: ClickhouseRepository

  constructor(
    private readonly profilesService: ProfilesService,
    private readonly authService: AuthService,
    private readonly spiesService: SpiesService
  ) {
    this.clickhouseRepo = ClickhouseRepository.init({})
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
  @Post('spy/createorupdate')
  async createSpy(
    @Body() body: CreateOrUpdateSpyDTO,
    @Request() req: { user: UserDTO }
  ): Promise<CreateOrUpdateSpyDTO> {
    const spy = await this.spiesService.createOrUpdate(body, req.user)

    const dto = new CreateOrUpdateSpyDTO()

    dto.id = spy.id
    dto.name = spy.name
    dto.profileNames = spy.profiles.map(profile => profile.username)
    dto.scrapingRateMaximum = spy.scrapingRateMaximum
    dto.scrapingRateMinimum = spy.scrapingRateMinimum
    dto.status = spy.status

    return dto
  }

  @UseGuards(JwtAuthGuard)
  @Post('spy/delete')
  async deleteSpy(
    @Body() body: SpyDTO,
    @Request() req: { user: UserDTO }
  ): Promise<CreateOrUpdateSpyDTO> {
    await this.spiesService.remove(body.id, req.user)
    return
  }

  @UseGuards(JwtAuthGuard)
  @Post('spy/list')
  async getSpyList(
    @Body() body: SpyListRequestDTO,
    @Request() req: { user: UserDTO }
  ): Promise<SpyListResponseDTO> {
    const [spies, count] = await this.spiesService.findByOwner(req.user, body)

    const rows: SpyDTO[] = spies.map(spy => {
      const {
        id,
        name,
        profiles,
        scrapingRateMaximum,
        scrapingRateMinimum,
        status,
        created,
        updated
      } = spy
      const profileNames = profiles.map(profile => profile.username)
      return {
        id,
        name,
        profileNames,
        scrapingRateMaximum,
        scrapingRateMinimum,
        status,
        created,
        updated
      }
    })
    return { rows, count }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profiles')
  async getProfilesList(@Request() req: { user: UserDTO }): Promise<any> {
    const profiles = await this.profilesService.findProfiles(req.user)
    return profiles
  }

  @UseGuards(JwtAuthGuard)
  @Post('feed/tweetsStats')
  async getTweetsList(
    @Request() req: { user: UserDTO },
    @Body() body: GetTweetsStatsListDTO
  ): Promise<any> {
    const { username, date, limit, offset } = body
    const tweets = await this.clickhouseRepo.selectStatsByUsername({
      username,
      date,
      limit,
      offset
    })
    return tweets
  }
}
