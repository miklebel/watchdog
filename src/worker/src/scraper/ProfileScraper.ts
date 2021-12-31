/* eslint-disable no-restricted-syntax */
/* eslint-disable no-return-assign */
/* eslint-disable no-use-before-define */
import puppeteer from 'puppeteer'
import { ProfileDTO } from '@miklebel/watchdog-core'

export class ProfileScraper {
  private browser: puppeteer.Browser

  private page: puppeteer.Page

  private profile: ProfileDTO

  constructor(browser: puppeteer.Browser, profile: ProfileDTO) {
    this.browser = browser
    this.profile = profile
  }

  public static async init(profile: ProfileDTO) {
    const browser = await puppeteer.launch({ headless: false })
    const profileScraper = new ProfileScraper(browser, profile)
    await profileScraper.newPage()
    await profileScraper.goto(`https://twitter.com/${profile.username}`)
    return profileScraper
  }

  private async newPage() {
    this.page = await this.browser.newPage()
  }

  private async goto(url: string) {
    await this.page.goto(url, { waitUntil: 'networkidle0' })
  }

  public async parseTweets() {
    return this.page.$$eval('article', articles =>
      articles.map(article => article.getBoundingClientRect())
    )
  }

  private async wait() {
    await this.page.waitForNetworkIdle({ idleTime: 500 })
  }

  private async getTweetsPositions() {
    return this.page.$$eval('article', articles =>
      articles.map(article => article.getBoundingClientRect().y)
    )
  }

  public async getCurrentTweetInfo() {
    const positions = await this.getTweetsPositions()
    const closest = (num, arr) => {
      let curr = arr[0]
      let diff = Math.abs(num - curr)
      let index = 0

      for (let val = 0; val < arr.length; val += 1) {
        const newdiff = Math.abs(num - arr[val])
        if (newdiff < diff) {
          diff = newdiff
          curr = arr[val]
          index = val
        }
      }
      return index
    }

    const closestTweetIndex = closest(0, positions)

    const tweetInfo = await this.page.$$eval(
      'article',
      (articles, tweetIndex: number) => {
        const aTag = articles[tweetIndex].querySelector('a[href*="/status/"]') as HTMLLinkElement
        const time = aTag.querySelector('time').dateTime
        return { url: aTag.href, time }
      },
      closestTweetIndex
    )
    return tweetInfo
  }

  public async scrollNextTweet() {
    const closestTweetsPositions = await this.getTweetsPositions()

    const nextTweetOffset = closestTweetsPositions.find(y => y > 100)
    await this.page.evaluate(offset => {
      window.scrollBy({ top: offset })
    }, nextTweetOffset)
    await this.wait()
  }

  public close() {
    return this.browser.close()
  }
}
