/* eslint-disable class-methods-use-this */
import { ClickHouse } from 'clickhouse'
import { ClickhouseTable, TableTweetsColumns } from './clickhouse/enums'
import {
  ClickHouseInsertInterface,
  ClickhouseOrderInterface,
  ClickhouseQueryInterface,
  ClickhouseWhereInterface
} from './clickhouse/interfaces'

export const ClickhouseRepositorySymbol = Symbol('ClickhouseRepositorySymbol')

export class ClickhouseRepository {
  private clickhouse: ClickHouse

  constructor(clickhouse: ClickHouse) {
    this.clickhouse = clickhouse
  }

  public static init() {
    const clickhouse = new ClickHouse({
      url: 'http://localhost',
      port: 8123,
      debug: false,
      basicAuth: null,
      isUseGzip: false,
      format: 'json',
      raw: false
    })
    console.log('Connected Clickhouse database.')

    return new ClickhouseRepository(clickhouse)
  }

  public select(selectOptions: ClickhouseQueryInterface) {
    console.log(this.selectSql(selectOptions))
    return this.clickhouse.query(this.selectSql(selectOptions)).toPromise()
  }

  public insert(insertOptions: ClickHouseInsertInterface) {
    return this.clickhouse.insert(this.insertSql(insertOptions)).toPromise()
  }

  private columnsSql(columns: TableTweetsColumns[]) {
    return `SELECT ${columns.join(', ')}`
  }

  private fromSql(table: ClickhouseTable) {
    return `FROM watchdog.${table}_buffer`
  }

  private whereSql(where: ClickhouseWhereInterface) {
    const whereStatements = Object.entries(where).reduce((prev, [column, values]) => {
      return [
        ...prev,
        `${column} IN (${values
          .map(value => (typeof value === 'string' ? `'${value.toLowerCase()}'` : value))
          .join(',')})`
      ]
    }, [])

    return `WHERE ${whereStatements.join(' AND ')}`
  }

  private orderSql(order?: ClickhouseOrderInterface) {
    if (order) {
      const orderBy = `ORDER BY ${order.column}`
      const direction = order.direction ? order.direction : ''
      return `${orderBy} ${direction}`
    }
    return ''
  }

  private limitSql(limit?: number) {
    if (limit) {
      return `LIMIT ${limit}`
    }
    return `LIMIT 100000`
  }

  private offsetSql(offset?: number) {
    if (offset) {
      return `OFFSET ${offset}`
    }
    return ''
  }

  private selectSql(selectParameters: ClickhouseQueryInterface) {
    const { columns, table, where, order, limit, offset } = selectParameters

    return [
      this.columnsSql(columns),
      this.fromSql(table),
      this.whereSql(where),
      this.orderSql(order),
      this.limitSql(limit),
      this.offsetSql(offset)
    ].join(' ')
  }

  private insertSql(insert: ClickHouseInsertInterface) {
    const columnsSql = Object.keys(insert.row).join(', ')
    const valuesSql = Object.entries(insert.row)
      .map(([key, value]) => {
        switch (key) {
          case TableTweetsColumns.date:
            return `toDate(${value})`
          case TableTweetsColumns.time:
            return `toDateTime(${value})`
          case TableTweetsColumns.id:
            return `${value}`
          case TableTweetsColumns.username:
            return `'${value.toString().toLowerCase()}'`

          default:
            throw new Error('Non-existent key in insert function')
        }
      })
      .join(', ')

    return `INSERT INTO watchdog.${insert.table}_buffer (${columnsSql}) values (${valuesSql})`
  }
}
