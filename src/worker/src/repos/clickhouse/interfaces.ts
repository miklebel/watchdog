import {
  ClickhouseTable,
  OrderDirection,
  TableTweetsColumns,
  TableTweetsStatsColumns
} from './enums'

export type ClickhouseWhereInterface =
  | {
      [key in TableTweetsColumns]?: Array<string | number>
    }
  | {
      [key in TableTweetsStatsColumns]?: Array<string | number>
    }

export interface ClickhouseOrderInterface {
  column: TableTweetsColumns | TableTweetsStatsColumns
  direction?: OrderDirection
}

export interface ClickhouseQueryInterface {
  table: ClickhouseTable
  columns: TableTweetsColumns[] | TableTweetsStatsColumns[]
  where: ClickhouseWhereInterface
  limit?: number
  offset?: number
  order?: ClickhouseOrderInterface
}

export type ClickHouseInsertDataInterface =
  | {
      [key in TableTweetsColumns]: string | number
    }
  | {
      [key in TableTweetsStatsColumns]: string | number
    }

export interface ClickHouseInsertInterface {
  row: ClickHouseInsertDataInterface
  table: ClickhouseTable
}
