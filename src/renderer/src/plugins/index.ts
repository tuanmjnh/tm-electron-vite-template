import moment from 'moment'
// import { axios, api } from './axios'
import * as directives from './directive'
import './page-title'
import './prototypes'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $moment: (inp?: moment.MomentInput, strict?: boolean) => moment.Moment,
    $createdAt: (dateTime: string, strict?: boolean) => moment.Moment,
    $getImageUrl: (name: string) => string
  }
}

// export {}  // Important! See note.

export default (app) => {
  //directives
  Object.keys(directives).forEach(key => {
    app.directive(key, directives[key])
  })

  // axios & api
  // for use inside Vue files (Options API) through const $axios = inject('$axios')
  // app.provide('$axios', axios)
  // this will allow you to use $api = inject('$api')(for Vue Options API form)
  // app.provide('$api', api)
  // app.config.globalProperties.$axios = axios
  // app.config.globalProperties.$api = api

  //moment
  app.config.globalProperties.$moment = moment
  app.config.globalProperties.$createdAt = (dateTime: string, strict?: boolean) => { return moment(dateTime, strict || false).format('DD/MM/YYYY - hh:mm') }

  //getImageUrl assets
  app.config.globalProperties.$getImageUrl = (name: string) => { return new URL(`/src/assets/${name}`, import.meta.url).href }
}
