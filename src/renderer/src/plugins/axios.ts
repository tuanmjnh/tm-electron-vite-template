import axios from 'axios'
import { ElNotification } from 'element-plus'
import { i18n } from '../i18n/index'
import stores from '../store'
export const CANCEL_TOKEN = axios.CancelToken

// Informational responses (100 – 199)
// Successful responses (200 – 299)
// Redirection messages (300 – 399)
// Client error responses (400 – 499)
// Server error responses (500 – 599)

// const storeApp = useStoreApp()

// Create API
// const api = axios.create({ baseURL: 'https://api.example.com' })
const api: any = axios.create({ // uploadURL: 'http://localhost:8080/api/upload',
  baseURL: import.meta.env.VITE_APP_API,//'http://localhost:8080/api', // '/api', // `${process.env.API}/`,
  // baseURL: 'https://tm-store-api-opkgzsyymq-uc.a.run.app/api',
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
  // proxy: {
  //   host: 'http://localhost',
  //   port: 8000
  //   // auth: { username: 'my-user', password: 'my-password' }
  // }
  // httpsAgent: new HttpsProxyAgent(process.env.API)
  // headers: {
  //   // Authorization: storageAuth.GetToken() || '',
  //   // Author: storageAuth.GetUid() || '',
  //   // Remember: storageAuth.GetRemember(),
  //   LocalIP: document.getElementById('local-ip').value
  // } })
})

// axios.get('/api/auth')
// request interceptor API
api.interceptors.request.use(
  async config => {
    const storeApp = stores.app()
    const storeAuthenticate = stores.authenticate()
    // Loading start
    await storeApp.setLoading({ key: config.method, value: true })
    // console.log(config.method)
    // do something before request is sent
    // let each request carry token
    // ['X-Token'] is a custom headers key
    // please modify it according to the actual situation
    // const authToken = await firebase.auth().currentUser.getIdToken(true)
    if (storeAuthenticate.token) config.headers['x-access-token'] = `Bearer ${storeAuthenticate.token}`
    // config.headers['userAgent'] = Platform.userAgent
    // config.headers['local-ip'] = await getLocalIP()
    // }
    return config
  },
  error => {
    // do something with request error
    // console.log(error) // for debug
    // Loading end
    const storeApp = stores.app()
    storeApp.setLoading()
    return Promise.reject(error)
  }
)

// response interceptor API
api.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    switch (response.status) {
      case 200:
        break
      case 201:
        ElNotification({ message: i18n.global.t('success.insert'), type: 'success', duration: 2000 })
        break
      case 202:
        ElNotification({ message: i18n.global.t('success.update'), type: 'success', duration: 2000 })
        break
      case 203:
        ElNotification({ message: response.data.success ? `${i18n.global.t('success.update')}: ${response.data.success.length} ${i18n.global.t('global.records')}` : i18n.global.t('success.update'), type: 'success', duration: 2000 })
        break
      case 204:
        ElNotification({ message: i18n.global.t('success.delete'), type: 'success', duration: 2000 })
        break
      default:
      // Notify.create({ message: response.data.msg ? i18n.global.t(`success.${response.data.msg}`) : i18n.global.t('success.process'), color: 'positive' })
    }
    // Loading end
    const storeApp = stores.app()
    storeApp.setLoading()
    // Return response
    return response.data
    // }
  },
  error => {
    // console.log(error.response.status) // for debug
    // console.log(error)
    const storeApp = stores.app()
    const reg = /Error: timeout+/
    if (reg.test(error.toString())) {
      ElNotification({ message: i18n.global.t('error.timeout'), type: 'danger', duration: 2000 } as any)
      storeApp.setLoading()
      return
    }
    if (error.message === 'canceled') {
      storeApp.setLoading()
      return
    }
    if (!error.response) {
      ElNotification({ message: i18n.global.t('error.system'), type: 'danger', duration: 2000 } as any)
      storeApp.setLoading()
      return
    }
    switch (error.response.status) {
      case 401:
        ElNotification({ message: i18n.global.t('error.tokenNoExist'), type: 'danger', duration: 2000 } as any)
        break
      case 402:
        ElNotification({ message: i18n.global.t('error.tokenInvalid'), type: 'danger', duration: 2000 } as any)
        break
      case 404:
        ElNotification({ message: i18n.global.t('error.noExist'), type: 'danger', duration: 2000 } as any)
        break
      case 500:
        ElNotification({ message: i18n.global.t('error.system'), type: 'danger', duration: 2000 } as any)
        break
      case 501:
        ElNotification({ message: i18n.global.t('error.exist'), type: 'danger', duration: 2000 } as any)
        break
      case 502:
        ElNotification({ message: i18n.global.t('error.accountNoExist'), type: 'danger', duration: 2000 } as any)
        break
      case 503:
        ElNotification({ message: i18n.global.t('error.accountNoExist'), type: 'danger', duration: 2000 } as any)
        break
      case 504:
        ElNotification({ message: i18n.global.t('error.accountLocked'), type: 'danger', duration: 2000 } as any)
        break
      case 505:
        ElNotification({ message: i18n.global.t('error.wrongPassword'), type: 'danger', duration: 2000 } as any)
        break
      default:
        ElNotification({ message: error.response.data.msg ? i18n.global.t(`error.${error.response.data.msg}`) : i18n.global.t('error.invalid'), type: 'danger', duration: 2000 } as any)
        break
    }
    // Loading end
    storeApp.setLoading()
    return Promise.reject(error)
  }
)

// Create API debonce
let call
// const apiDebonce = (config = {}) => {
//   if (call) call.cancel('canceled')
//   call = axios.CancelToken.source()
//   config.cancelToken = call.token
//   return api(config)
// }

api.debonce = (config: any = {}) => {
  if (call) call.cancel('canceled')
  call = axios.CancelToken.source()
  config.cancelToken = call.token
  return api(config)
}

// Config boot globalProperties
// export default boot(({ app }) => {
//   // for use inside Vue files (Options API) through this.$axios and this.$api
//   // for use: const { $axios } = getCurrentInstance().appContext.config.globalProperties
//   app.config.globalProperties.$axios = axios
//   // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
//   //       so you won't necessarily have to import axios in each vue file

//   // for use: const { $api } = getCurrentInstance().appContext.config.globalProperties
//   app.config.globalProperties.$api = api
//   // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
//   //       so you can easily perform requests against your app's API
// })

// Config inject provide
// export default boot(({ app }) => {
//   // for use inside Vue files (Options API) through const $axios = inject('$axios')
//   app.provide('$axios', axios)
//   // this will allow you to use $api = inject('$api')(for Vue Options API form)
//   app.provide('$api', api)
// })


export { axios, api }
