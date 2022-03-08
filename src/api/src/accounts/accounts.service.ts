import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, FindOneOptions, Repository } from 'typeorm'
import {
  CreateOrUpdateAccountDTO,
  Account,
  AccountListRequestDTO,
  UserDTO
} from '@miklebel/watchdog-core'
import { UsersService } from '../users/users.service'

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
    private usersService: UsersService
  ) {}

  findAll(): Promise<Account[]> {
    return this.accountsRepository.find()
  }

  findOne(id: string, options?: FindOneOptions<Account>): Promise<Account> {
    return this.accountsRepository.findOne(id, options)
  }

  async findByOwner(user: UserDTO, options: AccountListRequestDTO): Promise<[Account[], number]> {
    const {
      limit,
      offset,
      order: { ascending, column }
    } = options

    return this.accountsRepository.findAndCount({
      where: { user: { id: user.id } },
      order: {
        [column]: ascending ? 'ASC' : 'DESC'
      },
      take: limit,
      skip: offset
    })
  }

  async createOrUpdate(
    createOrUpdateAccountDTO: CreateOrUpdateAccountDTO,
    user: UserDTO
  ): Promise<Account> {
    const account = this.accountsRepository.create()

    const foundUser = await this.usersService.findOne(user.id)

    account.id = createOrUpdateAccountDTO.id
    account.username = createOrUpdateAccountDTO.username
    account.password = createOrUpdateAccountDTO.password
    account.status = createOrUpdateAccountDTO.status
    account.user = foundUser

    return this.accountsRepository.save(account)
  }

  async remove(id: number, user: UserDTO): Promise<DeleteResult> {
    return await this.accountsRepository.delete({ user: { id: user.id }, id })
  }
}
