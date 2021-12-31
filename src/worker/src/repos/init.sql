CREATE TABLE IF NOT EXISTS watchdog.tweets (
    `date` Date,
    `time` DateTime,
    `id` UInt64,
    `username` LowCardinality(String)
) ENGINE = MergeTree PARTITION BY toYYYYMM(date)
ORDER BY (date, id, username) SETTINGS index_granularity = 8192;
;
CREATE TABLE IF NOT EXISTS watchdog.tweets_buffer AS watchdog.tweets ENGINE = Buffer(
    watchdog,
    tweets,
    16,
    10,
    100,
    10000,
    1000000,
    10000000,
    100000000
);
;
CREATE TABLE watchdog.tweets_stats (
    `date` Date,
    `time` DateTime,
    `id` UInt64,
    `username` LowCardinality(String),
    `likes` UInt32,
    `quotes` UInt32,
    `retweets` UInt32
) ENGINE = MergeTree PARTITION BY toYYYYMM(date)
ORDER BY (date, id, username) SETTINGS index_granularity = 8192;
;
CREATE TABLE IF NOT EXISTS watchdog.tweets_stats_buffer AS watchdog.tweets_stats ENGINE = Buffer(
    watchdog,
    tweets_stats,
    16,
    10,
    100,
    10000,
    1000000,
    10000000,
    100000000
);