/* eslint-disable no-shadow */
export enum ClickhouseTable {
  tweets = 'tweets'
}

export enum TableTweetsColumns {
  date = 'date',
  time = 'time',
  id = 'id',
  username = 'username'
}

export type OrderDirection = 'ASC' | 'DESC'
