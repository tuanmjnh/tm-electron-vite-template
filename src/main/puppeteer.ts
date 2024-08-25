const { ipcMain } = require('electron')
import { delay } from '../utils/promise'
import { join } from "path"
const puppeteer = require('puppeteer')
interface IBrowsers {
  id: string,
  browser: any,
  // pid: number,
  // wsEndpoint: any
}
const DEFAULT_ARGS = [
  '--disable-background-networking',
  '--enable-features=NetworkService,NetworkServiceInProcess',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-extensions-with-background-pages',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-extensions',
  // BlinkGenPropertyTrees disabled due to crbug.com/937609
  '--disable-features=TranslateUI,BlinkGenPropertyTrees',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-popup-blocking',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-sync',
  '--force-color-profile=srgb',
  '--metrics-recording-only',
  '--no-first-run',
  '--enable-automation',
  '--password-store=basic',
  '--use-mock-keychain',
]


const browsers = [] as IBrowsers[]
ipcMain.handle('puppeteer:chrome', async (event, args) => {
  // 193.37.212.109:29000:gukwixkx:Gc749pdCn8 - 4G
  // 165.232.155.139:17991:dsykzknj:m74kHf2Nt2 - 5G
  // args.proxy = 'gukwixkx:Gc749pdCn8@193.37.212.109:29000'
  // 209.114.25.151:10506:vaw7yAkPx0:SKYCDYbIYT

  // args.proxy = { username: 'vaw7yAkPx0', password: 'SKYCDYbIYT', host: '209.114.25.151', port: '10506' } as any
  // args.userAgent = 'Mozilla/5.0 (Macintosh Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15'
  // args.profile = { path: 'D:\\profiles\\chrome', name: 'Selenium 1' }
  // console.log(args)
  // Launch Puppeteer with a custom browser instance
  const existIndex = browsers.findIndex(x => x.id == args.key)
  if (existIndex >= 0) {
    browsers[existIndex].browser.close()
    browsers.splice(existIndex, 1)
  }
  const options = {
    // headless: 'new',
    headless: false,
    executablePath: args.executablePath, //'C:/Program Files/Google/Chrome/Application/chrome.exe',
    ignoreHTTPSErrors: true,
    // devtools: true,
    timeout: 3000,
    defaultViewport: null,
    ignoreDefaultArgs: ['--enable-automation', '--disable-extensions'],
    args: [
      //--disable-features=site-per-process
      // '--no-sandbox',
      '--enable-gpu',
      '--disable-infobars',
      `--user-data-dir=${join(args.profilePath, args.key)}`,
      // `--profile-directory=${args.profile.name}`,
      // `--proxy-server=${args.proxy.host}:${args.proxy.port}`
    ]
  }
  const browser = await puppeteer.launch(options)
  // const wsEndpoint = browser.wsEndpoint()
  // const pid = browser.process().pid
  browsers.push({
    id: args.key,
    browser: browser
  })
  // console.log(pid, ' - ', wsEndpoint)

  // Open a new page
  const [page] = await browser.pages()

  // setUserAgent
  await page.setUserAgent(args.userAgent)

  // authenticate proxy
  // await page.authenticate({
  //   username: args.proxy.username,
  //   password: args.proxy.password,
  // })

  // Navigate to a website
  await page.goto('https://ipfighter.com/')

  // Close the browser
  // await browser.close()

  // wait document ready
  // Wait for the document to be ready
  await page.waitForFunction(() => document.readyState === 'complete')

  // execute script
  // Execute a script in the context of the page
  await delay(2000)
  const result = await page.evaluate(() => {
    // Delay
    // await new Promise(res => setTimeout(res, 2000))

    // Your JavaScript code here
    // For example, you can manipulate the DOM or return some data
    const button = document.querySelector('[class="home_btnLink__m_4M4"]') as HTMLElement
    console.log(button)
    if (button) button.click()
    return document.title
  })

  // console.log('Page title:', result)

  return JSON.stringify(result)
  // await driver.executeScript(() => {
  //   const button = document.querySelector('[class="home_btnLink__m_4M4"]') as HTMLElement
  //   if (button) button.click()
  // })
})


async function timeZoneChecker({ timeZone }) {
  const puppeteer = require('puppeteer')
  // all kind of config to pass to browser
  const launchConfig = {} as any

  if (timeZone) {
    launchConfig.env = {
      TZ: timeZone,
      ...process.env,
    }
  }
  const browser = await puppeteer.launch(launchConfig)
  const page = await browser.newPage()

  await page.goto('https://whoer.net/')
  const detectedTimezone = await page.$eval('.ico-timesystem', e => e.parentNode.innerText)
  await page.screenshot({ path: `screenshots/timeZone_${timeZone.replace('/', '-')}.png`, fullPage: true })

  await browser.close()

  return { timeZone, detectedTimezone }
}

// Promise.all([
//   timeZoneChecker({ timeZone: 'Australia/Melbourne' }),
//   timeZoneChecker({ timeZone: 'Asia/Singapore' })
// ]).then(console.log)

export { }
