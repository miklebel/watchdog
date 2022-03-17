import { Test, TestingModule } from '@nestjs/testing'
import { SpiesService } from './spies.service'

describe('UsersService', () => {
  let service: SpiesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpiesService]
    }).compile()

    service = module.get<SpiesService>(SpiesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
