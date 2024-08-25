import { createI18n } from 'vue-i18n'
import type { App } from 'vue'
// import viVN from '../locales/vi_VN.json'
// import enUS from '../locales/en_US.json'
// import zhCN from '../locales/zh_CN.json'
import { local } from '@/utils'

// const { RENDERER_VITE_DEFAULT_LANG } = import.meta.env

// const locales = {}
// Object.values(import.meta.glob<any>('../locales/*.json', { eager: true })).map(i => {
//   console.log(i)
// })
// .map((i: any) => JSON.parse(JSON.stringify(i.default)))

const modulesFiles = import.meta.glob('../locales/*.json', { eager: true })
export const locales = Object.keys(modulesFiles).reduce((locales, currentValue) => {
  const moduleName = currentValue.replace('../locales/', '').replace(/\.\w+$/, '')
  locales[moduleName] = (modulesFiles[currentValue] as any).default
  return locales
}, {})

export const languages = Object.keys(locales).map(x => {
  return {
    label: locales[x].initial.title,
    order: locales[x].initial.order,
    value: x
  }
}).sort((a, b) => a.order - b.order)

export const i18n = createI18n({
  legacy: false,
  locale: local.get('lang') || import.meta.env.RENDERER_VITE_DEFAULT_LANG, // Default display language
  fallbackLocale: import.meta.env.RENDERER_VITE_DEFAULT_LANG,
  messages: locales,//{
  //   viVN,
  //   zhCN,
  //   enUS,
  // },
  // Missing internationalization key warning
  // missingWarn: false,

  // Missing fallback content warning
  fallbackWarn: false,
})

export function install(app: App) {
  app.use(i18n)
}
