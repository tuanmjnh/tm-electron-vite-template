export interface IElectronAPI {
  loadPreferences: () => Promise<void>
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
    // electron: any
    DarkMode: any
    DarkMode: any
    Dialog: any
    Config: any
    Puppeteer: any
    $loadingBar: import('naive-ui').LoadingBarApi
    $dialog: import('naive-ui').DialogApi
    $message: import('naive-ui').MessageApi
    $notification: import('naive-ui').NotificationApi
  }
  interface Navigator {
    browserLanguage: string
  }
}
declare const APP_VERSION: string
// declare const $t: any
