import { Controller, Get, Req, Post, UseGuards, Body, Request, Put } from '@nestjs/common'
import { AuthService } from './services/auth/auth.service'
import { LocalAuthGuard } from './services/auth/local.authguard'
import {
  CreateUserDTO,
  UserDTO,
  CreateOrUpdateSpyDTO,
  SpyListRequestDTO,
  SpyDTO,
  SpyListResponseDTO,
  ClickhouseRepository,
  GetTweetsStatsListDTO,
  FollowerProfilerListRequestDTO,
  FollowerProfilerListResponseDTO,
  FollowerProfilerDTO,
  CreateOrUpdateFollowerProfilerDTO,
  AccountListRequestDTO,
  AccountListResponseDTO,
  AccountDTO,
  CreateOrUpdateAccountDTO
} from '@miklebel/watchdog-core'
import { JwtAuthGuard } from './services/auth/jwt.authguard'
import { SpiesService } from './services/spies/spies.service'
import { ProfilesService } from './services/profiles/profiles.service'
import { FollowerProfilerService } from './services/followerProfilers/followerProfilers.service'
import { AccountsService } from './services/accounts/accounts.service'

@Controller()
export class AppController {
  private clickhouseRepo: ClickhouseRepository

  constructor(
    private readonly profilesService: ProfilesService,
    private readonly authService: AuthService,
    private readonly spiesService: SpiesService,
    private readonly followerProfilerService: FollowerProfilerService,
    private readonly accountsService: AccountsService
  ) {
    this.clickhouseRepo = ClickhouseRepository.init({})
  }

  @UseGuards(LocalAuthGuard)
  @Post('api/auth/login')
  async login(@Req() req) {
    return this.authService.login(req.user)
  }

  @Post('api/auth/register')
  async register(@Body() body: CreateUserDTO): Promise<UserDTO> {
    const newUser = this.authService.createUser(body)
    return (await newUser).publicDTO()
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/auth/profile')
  getProfile(@Request() req: { user: UserDTO }): UserDTO {
    console.log(req.user)
    return req.user
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/spy/createorupdate')
  async createSpy(
    @Body() body: CreateOrUpdateSpyDTO,
    @Request() req: { user: UserDTO }
  ): Promise<CreateOrUpdateSpyDTO> {
    const spy = await this.spiesService.createOrUpdate(body, req.user)

    const dto = new CreateOrUpdateSpyDTO()

    dto.id = spy.id
    dto.name = spy.name
    dto.profileNames = spy.profiles.map(profile => profile.username.toLowerCase())
    dto.scrapingRateMaximum = spy.scrapingRateMaximum
    dto.scrapingRateMinimum = spy.scrapingRateMinimum
    dto.status = spy.status

    return dto
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/spy/delete')
  async deleteSpy(
    @Body() body: SpyDTO,
    @Request() req: { user: UserDTO }
  ): Promise<CreateOrUpdateSpyDTO> {
    await this.spiesService.remove(body.id, req.user)
    return
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/spy/list')
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
      const profileNames = profiles.map(profile => profile.username.toLowerCase())
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
  @Get('api/profiles')
  async getProfilesList(@Request() req: { user: UserDTO }): Promise<any> {
    const profiles = await this.profilesService.findProfiles(req.user)
    return profiles
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/feed/tweetsStats')
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

  @UseGuards(JwtAuthGuard)
  @Post('api/followerProfiler/list')
  async getFollowerProfilerList(
    @Body() body: FollowerProfilerListRequestDTO,
    @Request() req: { user: UserDTO }
  ): Promise<FollowerProfilerListResponseDTO> {
    const [followerProfilers, count] = await this.followerProfilerService.findByOwner(
      req.user,
      body
    )

    const rows: FollowerProfilerDTO[] = followerProfilers.map(followerProfiler => {
      const { id, name, status, profile, created, updated } = followerProfiler
      const profileName = profile.username.toLowerCase()
      return {
        id,
        name,
        profileName,
        status,
        created,
        updated
      }
    })
    return { rows, count }
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/followerProfiler/createorupdate')
  async createFollowerProfiler(
    @Body() body: CreateOrUpdateFollowerProfilerDTO,
    @Request() req: { user: UserDTO }
  ): Promise<CreateOrUpdateFollowerProfilerDTO> {
    const spy = await this.followerProfilerService.createOrUpdate(body, req.user)

    const dto = new CreateOrUpdateFollowerProfilerDTO()

    dto.id = spy.id
    dto.name = spy.name
    dto.profileName = spy.profile.username.toLowerCase()
    dto.status = spy.status

    return dto
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/followerProfiler/delete')
  async deleteFollowerProfiler(
    @Body() body: FollowerProfilerDTO,
    @Request() req: { user: UserDTO }
  ): Promise<CreateOrUpdateFollowerProfilerDTO> {
    await this.followerProfilerService.remove(body.id, req.user)
    return
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/account/list')
  async getAccountList(
    @Body() body: AccountListRequestDTO,
    @Request() req: { user: UserDTO }
  ): Promise<AccountListResponseDTO> {
    const [accounts, count] = await this.accountsService.findByOwner(req.user, body)

    const rows: AccountDTO[] = accounts.map(account => {
      const { id, username, status, created, updated } = account
      return {
        id,
        username: username.toLowerCase(),
        status,
        created,
        updated
      }
    })
    return { rows, count }
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/account/createorupdate')
  async createAccount(
    @Body() body: CreateOrUpdateAccountDTO,
    @Request() req: { user: UserDTO }
  ): Promise<CreateOrUpdateAccountDTO> {
    const account = await this.accountsService.createOrUpdate(body, req.user)
    const { password, status, username, id } = account
    const dto = new CreateOrUpdateAccountDTO()

    dto.password = password
    dto.status = status
    dto.username = username
    dto.id = id

    return dto
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/account/delete')
  async deleteAccount(
    @Body() body: AccountDTO,
    @Request() req: { user: UserDTO }
  ): Promise<CreateOrUpdateAccountDTO> {
    await this.accountsService.remove(body.id, req.user)
    return
  }
}
