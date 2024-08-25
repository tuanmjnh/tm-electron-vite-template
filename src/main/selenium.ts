const { BrowserWindow, Menu, ipcMain } = require('electron')
const webdriver = require('selenium-webdriver')
const path = require('path')

interface Proxy {
  username: string,
  password: string,
  host: string,
  port: string
}
function sendKeybinding(win, keyCode) {
  const modifiers: Array<string> = []
  modifiers.push('shift') // 'control', 'meta', etc.
  win.webContents.sendInputEvent({ type: 'keyDown', modifiers, keyCode })
  win.webContents.sendInputEvent({ type: 'char', modifiers, keyCode })
  win.webContents.sendInputEvent({ type: 'keyUp', modifiers, keyCode })
}

export const WindowChome = ({ parent, modal = false }) => {
  ipcMain.on('window-chrome', (event, arg) => {
    const window = new BrowserWindow({
      title: 'Window chrome',
      parent: parent,
      modal: modal
    })
    window.loadURL(path.resolve(process.cwd(), 'public', 'keybind.html'))
    const menuTemplate = [
      {
        label: 'Show Keymap',
        click(menuItem, browserWindow) {
          sendKeybinding(browserWindow, '?')
        }
      }
    ]
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
  })
}

export const SeleniumTestChrome = ({ parent, modal = false }) => {
  ipcMain.on('selenium-chrome', async (event, arg) => {
    const capabilities = {
      'platform': 'WIN10',
      'browserName': 'chrome',
      'version': 'latest',
      'name': 'NodeJS Sample Test'
    }
    const driver = new webdriver.Builder()
      // .usingServer('https://api_key:api_secret@hub.testingbot.com/wd/hub')
      .withCapabilities(capabilities)
      .build()
    await driver.get('https://www.google.com/ncr')
    const inputField = await driver.findElement(webdriver.By.name('q'))
    await inputField.sendKeys('TestingBot', webdriver.Key.ENTER)
    try {
      await driver.wait(webdriver.until.titleMatches(/TestingBot/i), 5000)
    } catch (e) {
      await inputField.submit()
    }
    try {
      await driver.wait(webdriver.until.titleMatches(/TestingBot/i), 5000)
      console.log(await driver.getTitle())
    } catch (e) {
      console.error(e)
    }
    // await driver.quit()
  })
}
export const SeleniumChrome = ({ parent, modal = false }) => {
  ipcMain.on('selenium-chrome', async (event, args) => {
    const browser = require('selenium-webdriver/chrome')
    // 193.37.212.109:29000:gukwixkx:Gc749pdCn8 - 4G
    // 165.232.155.139:17991:dsykzknj:m74kHf2Nt2 - 5G
    // args.proxy = 'gukwixkx:Gc749pdCn8@193.37.212.109:29000'
    args.proxy = { username: 'gukwixkx', password: 'Gc749pdCn8', host: '193.37.212.109', port: '29000' } as Proxy
    args.userAgent = 'Mozilla/5.0 (Macintosh Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15'
    args.profile = { path: 'D:\\profiles\\chrome', name: 'Selenium 1' }
    const proxy = `http://${args.proxy.username}:${args.proxy.password}@${args.proxy.host}:${args.proxy.port}`
    console.log(proxy)
    const options = new browser.Options()
      .addArguments(`user-data-dir=${args.profile.path}`)
      .addArguments(`profile-directory=${args.profile.name}`)
      .addArguments('disable-infobars')
      .addArguments(`--proxy-server=${proxy}`)
      .excludeSwitches('enable-automation')
      .setUserPreferences({ credential_enable_service: false })
    // options.addArguments(`--proxy-server=http://${args.proxy}`)
    // options.addArguments([`user-agent='${args.userAgent}'`])
    const capabilities = {
      // 'platform': 'WIN10',
      'browserName': 'chrome',
      // 'version': 'latest',
      // 'name': 'NodeJS Sample Test'
      // proxy: {
      //   proxyType: 'MANUAL',
      //   httpProxy: `${args.proxy.host}:${args.proxy.port}`,
      //   sslProxy: `${args.proxy.host}:${args.proxy.port}`,
      //   socksUsername: args.proxy.username,
      //   socksPassword: args.proxy.password
      // }
    }
    options.capabilities = webdriver.Capabilities.chrome()
    const driver = new webdriver.Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .withCapabilities(capabilities)
      .build()
    await driver.get('https://ipfighter.com/')

    // wait document ready
    driver.wait(function () {
      return driver.executeScript('return document.readyState').then(function (readyState) {
        return readyState === 'complete'
      })
    })
    // execute script
    await driver.executeScript(() => {
      const button = document.querySelector('[class="home_btnLink__m_4M4"]') as HTMLElement
      if (button) button.click()
    })
  })
}

export const SeleniumFirefox1 = ({ parent, modal = false }) => {
  ipcMain.on('selenium-firefox', async (event, args) => {
    // 193.37.212.109:29000:gukwixkx:Gc749pdCn8 - 4G
    // 165.232.155.139:17991:dsykzknj:m74kHf2Nt2 - 5G
    // args.proxy = 'gukwixkx:Gc749pdCn8@193.37.212.109:29000'
    args.proxy = { username: 'gukwixkx', password: 'Gc749pdCn8', host: '193.37.212.109', port: '29000' } as Proxy
    args.userAgent = 'Mozilla/5.0 (Macintosh Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15'
    args.profile = { path: 'D:\\profiles\\firefox', name: 'Selenium 1' }

    const browser = require('selenium-webdriver/firefox')
    const capabilities = webdriver.Capabilities.firefox()
    capabilities
      .set('browserName', 'firefox')
      .set('platform', 'WIN10')
      .set('version', 'latest')
      .set('name', 'Firefox profile selenium')
      .set('acceptSslCerts', true)
      .set('acceptInsecureCerts', true)
      .set('marionette', false)
    // Create a Firefox profile
    const profile = new browser.Profile()

    // Set proxy information in the profile
    profile.setPreference('network.proxy.type', 1)
      .setPreference('network.proxy.http', args.proxy.host)
      .setPreference('network.proxy.http_port', parseInt(args.proxy.port, 10))
      .setPreference('network.proxy.ssl', args.proxy.host)
      .setPreference('network.proxy.ssl_port', parseInt(args.proxy.port, 10))
      .setPreference('network.proxy.socks', args.proxy.host)
      .setPreference('network.proxy.socks_port', parseInt(args.proxy.port, 10))

      // If your proxy requires authentication
      .setPreference('network.proxy.socks_username', args.proxy.username)
      .setPreference('network.proxy.socks_password', args.proxy.password)

    // Set up Firefox options
    const options = new browser.Options().setProfile(profile)

    // Create WebDriver with Firefox options
    const driver = new webdriver.Builder().forBrowser('firefox').setFirefoxOptions(options).build()

    await driver.get('https://ipfighter.com/')

    // wait document ready
    driver.wait(function () {
      return driver.executeScript('return document.readyState').then(function (readyState) {
        return readyState === 'complete'
      })
    })
    // execute script
    await driver.executeScript(() => {
      const button = document.querySelector('[class="home_btnLink__m_4M4"]') as HTMLElement
      if (button) button.click()
    })
  })
}

export const SeleniumFirefox = ({ parent, modal = false }) => {
  ipcMain.on('selenium-firefox', async (event, args) => {
    // 193.37.212.109:29000:gukwixkx:Gc749pdCn8 - 4G
    // 165.232.155.139:17991:dsykzknj:m74kHf2Nt2 - 5G
    // args.proxy = 'gukwixkx:Gc749pdCn8@193.37.212.109:29000'
    args.proxy = { username: 'gukwixkx', password: 'Gc749pdCn8', host: '193.37.212.109', port: '29000' } as Proxy
    args.userAgent = 'Mozilla/5.0 (Macintosh Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15'
    args.profile = { path: 'D:\\profiles\\firefox', name: 'Selenium 1' }

    const browser = require('selenium-webdriver/firefox')
    const capabilities = webdriver.Capabilities.firefox()
    capabilities
      .set('browserName', 'firefox')
      .set('platform', 'WIN10')
      .set('version', 'latest')
      .set('name', 'Firefox profile selenium')
      .set('acceptSslCerts', true)
      .set('acceptInsecureCerts', true)
      .set('marionette', false)
    const options = new browser.Options()
      // .setProfile(path.join(args.profile.path, args.profile.name))
      // -marionette -foreground -no-remote
      // .addArguments('-marionette', '')
      .addArguments('-profile', path.join(args.profile.path, args.profile.name))
      .setPreference('general.useragent.override', args.userAgent)
      // Set proxy information in the profile
      .setPreference('network.proxy.type', 1)
      .setPreference('network.proxy.http', args.proxy.host)
      .setPreference('network.proxy.http_port', parseInt(args.proxy.port, 10))
      .setPreference('network.proxy.ssl', args.proxy.host)
      .setPreference('network.proxy.ssl_port', parseInt(args.proxy.port, 10))
      // .setPreference('network.proxy.socks', args.proxy.host)
      // .setPreference('network.proxy.socks_port', parseInt(args.proxy.port, 10))
      .setPreference('network.proxy.share_proxy_settings', true)
      // Enable password saving
      .setPreference('signon.autologin.proxy', true)
      .setPreference('signon.rememberSignons', true)
      .setPreference('signon.autologin.enabled', true)
      .setPreference('security.insecure_field_warning.contextual.enabled', false)
      // If your proxy requires authentication
      .setPreference('network.proxy.socks_username', args.proxy.username)
      .setPreference('network.proxy.socks_password', args.proxy.password)

    const driver = new webdriver.Builder()
      .forBrowser('firefox')
      .withCapabilities(capabilities)
      .setFirefoxOptions(options)
      // .setProxy(proxy.manual({http: 'host:1234'}))
      .build()
    //

    // const alert = driver.switchTo().alert()
    // alert.accept()

    // await driver.get('https://ipfighter.com/')


    // alert.sendKeys(args.proxy.username)
    // alert.setAuthenticationCredentials(args.proxy.username, args.proxy.password)
    // alert.accept()
    // System.Threading.Thread.Sleep(1000)
    // alert.SendKeys(Keys.Tab)
    // System.Threading.Thread.Sleep(1000)
    // alert.SendKeys( args.proxy.password)
    // System.Threading.Thread.Sleep(1000)
    // alert.Accept()

    // wait document ready
    driver.wait(function () {
      return driver.executeScript('return document.readyState').then(function (readyState) {
        return readyState === 'complete'
      })
    })
    // setTimeout(() => {
    //   console.log('5000')
    //   driver.switchTo().alert().then(al => {
    //     al.sendKeys(args.proxy.username)
    //   })
    // }, 5000)

    // driver.switchTo().alert().thenCatch(function (e) {
    //   // 27 maps to bot.ErrorCode.NO_MODAL_DIALOG_OPEN: http://selenium.googlecode.com/git/docs/api/javascript/source/lib/atoms/error.js.src.html#l31
    //   if (e.code !== 27) { throw e }
    // }).then(function (alert) {
    //   if (alert) { return alert.dismiss() }
    // })

    const URL = "https://" + args.proxy.username + ":" + args.proxy.password + "@" + "https://ipfighter.com"
    driver.get(URL)

    // execute script
    // await driver.executeScript(() => {
    //   const button = document.querySelector('[class="home_btnLink__m_4M4"]') as HTMLElement
    //   if (button) button.click()
    // })
  })
}
