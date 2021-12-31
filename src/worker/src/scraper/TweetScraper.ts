/* eslint-disable no-restricted-syntax */
/* eslint-disable no-return-assign */
/* eslint-disable no-use-before-define */
import puppeteer from 'puppeteer'
import { TweetJobDTO } from '@miklebel/watchdog-core'

export class TweetScraper {
  private browser: puppeteer.Browser

  private page: puppeteer.Page

  private tweet: TweetJobDTO

  constructor(browser: puppeteer.Browser, tweet: TweetJobDTO) {
    this.browser = browser
    this.tweet = tweet
  }

  public static async init(tweet: TweetJobDTO) {
    const browser = await puppeteer.launch({ headless: false })
    const tweetScraper = new TweetScraper(browser, tweet)
    await tweetScraper.newPage()
    await tweetScraper.goto(`https://twitter.com/${tweet.username}/status/${tweet.id}`)
    return tweetScraper
  }

  private async newPage() {
    this.page = await this.browser.newPage()
  }

  private async goto(url: string) {
    await this.page.goto(url, { waitUntil: 'networkidle0' })
    // await new Promise(res => setTimeout(res, 5_000_000))
  }

  public async parseTweet() {
    const { likes, quotes, retweets } = await this.page.evaluate(async id => {
      const result = {
        retweets: +Array.from(document.querySelectorAll('a'))
          .find(a => a.href.endsWith(`status/${id}/retweets`))
          ?.querySelector('span').innerText,
        quotes: +Array.from(document.querySelectorAll('a'))
          .find(a => a.href.endsWith(`status/${id}/retweets/with_comments`))
          ?.querySelector('span').innerText,
        likes: +Array.from(document.querySelectorAll('a'), tag => tag)
          .find(a => a.href.endsWith(`status/${id}/likes`))
          ?.querySelector('span').innerText
      }
      return result
    }, this.tweet.id)
    console.log({ likes, quotes, retweets })
    return { likes, quotes, retweets }
  }

  public close() {
    return this.browser.close()
  }
}
