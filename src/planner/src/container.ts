import { LoggerSymbol } from '@miklebel/watchdog-core/dist/infra/Logger'
import { container, DependencyContainer } from 'tsyringe'
import {
  ClickhouseRepository,
  ClickhouseRepositorySymbol,
  loggerPino
} from '@miklebel/watchdog-core'
import { TypeOrmRepository, TypeOrmRepositorySymbol } from './repos/typeormRepo'

export const createContainer = async (): Promise<DependencyContainer> => {
  const typeormRepository = await TypeOrmRepository.init()
  const clickhouseRepository = ClickhouseRepository.init({})

  container.register(LoggerSymbol, { useValue: loggerPino('worker-service') })
  container.register(TypeOrmRepositorySymbol, { useValue: typeormRepository })
  container.register(ClickhouseRepositorySymbol, { useValue: clickhouseRepository })
  return container
}
