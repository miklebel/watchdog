import { Test, TestingModule } from '@nestjs/testing'
import { FollowerProfilerService } from './followerProfilers.service'

describe('UsersService', () => {
  let service: FollowerProfilerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FollowerProfilerService]
    }).compile()

    service = module.get<FollowerProfilerService>(FollowerProfilerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
