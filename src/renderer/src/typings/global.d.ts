/* Stores the database entity table type, the specific content is in ./entities */
import { $t } from '../utils'
declare namespace Entity {
}

/* The data types returned by various interfaces are as follows: ./api */
declare namespace Api {

}

// interface Window {
//   $loadingBar: import('naive-ui').LoadingBarApi
//   $dialog: import('naive-ui').DialogApi
//   $message: import('naive-ui').MessageApi
//   $notification: import('naive-ui').NotificationApi
// }

declare const AMap: any
declare const BMap: any

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: typeof $t
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent
  export default component
}

declare namespace NaiveUI {
  type ThemeColor = 'default' | 'error' | 'primary' | 'info' | 'success' | 'warning'
}

declare namespace Storage {
  interface Session {
    dict: DictMap
  }

  interface Local {
    /* Storing user information */
    userInfo: Api.Login.Info
    /* Storing access tokens */
    accessToken: string
    /* Storage refresh token */
    refreshToken: string
    /* Store login account */
    loginAccount: any
    /* Store current language */
    lang: App.lang
  }
}

declare namespace App {
  type lang = 'enUS' | 'viVN' | 'zhCN'
}

interface DictMap {
  [key: string]: Entity.Dict[]
}
