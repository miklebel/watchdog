/* eslint-disable no-shadow */
export enum ClickhouseTable {
  tweets = 'tweets',
  tweets_stats = 'tweets_stats'
}

export enum TableTweetsColumns {
  date = 'date',
  time = 'time',
  id = 'id',
  username = 'username'
}

export enum TableTweetsStatsColumns {
  date = 'date',
  time = 'time',
  id = 'id',
  username = 'username',
  likes = 'likes',
  quotes = 'quotes',
  retweets = 'retweets'
}

export type OrderDirection = 'ASC' | 'DESC'
