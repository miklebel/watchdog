import { ClickhouseTable, OrderDirection, TableTweetsColumns } from './enums'

export type ClickhouseWhereInterface = {
  [key in TableTweetsColumns]?: Array<string | number>
}

export interface ClickhouseOrderInterface {
  column: TableTweetsColumns
  direction?: OrderDirection
}

export interface ClickhouseQueryInterface {
  table: ClickhouseTable
  columns: TableTweetsColumns[]
  where: ClickhouseWhereInterface
  limit?: number
  offset?: number
  order?: ClickhouseOrderInterface
}

export type ClickHouseInsertDataInterface = {
  [key in TableTweetsColumns]: string | number
}

export interface ClickHouseInsertInterface {
  row: ClickHouseInsertDataInterface
  table: ClickhouseTable
}
