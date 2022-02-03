/* eslint-disable no-restricted-syntax */
/* eslint-disable no-return-assign */
/* eslint-disable no-use-before-define */
import pupExtra from 'puppeteer-extra'
import puppeteer from 'puppeteer'
import { TweetJobDTO } from '@miklebel/watchdog-core'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

export class TweetScraper {
  private browser: puppeteer.Browser

  private page: puppeteer.Page

  private tweet: TweetJobDTO

  constructor(browser: puppeteer.Browser, tweet: TweetJobDTO) {
    this.browser = browser
    this.tweet = tweet
  }

  public static async init(tweet: TweetJobDTO) {
    pupExtra.use(StealthPlugin())
    const browser = await pupExtra.launch({ headless: true })
    const tweetScraper = new TweetScraper(browser, tweet)

    try {
      await tweetScraper.newPage()
      await tweetScraper.goto(`https://twitter.com/${tweet.username}/status/${tweet.id}`)
      return tweetScraper
    } catch (err) {
      await tweetScraper.close()
      throw err
    }
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
          ?.querySelector('span')
          .innerText.replace(/[^0-9]/g, ''),
        quotes: +Array.from(document.querySelectorAll('a'))
          .find(a => a.href.endsWith(`status/${id}/retweets/with_comments`))
          ?.querySelector('span')
          .innerText.replace(/[^0-9]/g, ''),
        likes: +Array.from(document.querySelectorAll('a'), tag => tag)
          .find(a => a.href.endsWith(`status/${id}/likes`))
          ?.querySelector('span')
          .innerText.replace(/[^0-9]/g, '')
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
