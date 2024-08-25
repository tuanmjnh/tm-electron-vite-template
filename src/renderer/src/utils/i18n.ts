import type { NDateLocale, NLocale } from 'naive-ui'
import { dateEnUS, enUS, viVN, zhCN, jaJP } from 'naive-ui'
import { i18n } from '@/modules/i18n'
// import { App } from '@/typings/global'

export function setLocale(locale: string) {
  i18n.global.locale.value = locale
}

export const $t = i18n.global.t

// App.lang,
export const naiveI18nOptions: Record<string, { locale: NLocale | null; dateLocale: NDateLocale | null }> = {
  viVN: {
    locale: viVN,
    dateLocale: dateEnUS
  },
  enUS: {
    locale: enUS,
    dateLocale: dateEnUS
  },
  zhCN: {
    locale: zhCN,
    dateLocale: dateEnUS
  },
  jaJP: {
    locale: jaJP,
    dateLocale: dateEnUS
  }
}
