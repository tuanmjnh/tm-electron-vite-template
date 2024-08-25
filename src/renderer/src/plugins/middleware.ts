import { Router } from '../router'
import pageTitle from './page-title'
// import type { NavigationGuard, RouteLocationNormalized } from 'vue-router'
// export interface RouteGuardContext {
//   to: RouteLocationNormalized
//   from: RouteLocationNormalized
// }
// export type RouteGuard = (ctx: RouteGuardContext) => ReturnType<NavigationGuard>
import stores from '../store'
// import * as auth from '@/api/auth'
// import * as userSetting from '@/api/user-setting'
// import NProgress from 'nprogress' // progress bar
// import '@/css/nprogress.css' // progress bar style

// NProgress Configuration
// NProgress.configure({
//   showSpinner: false,
//   easing: 'ease',
//   speed: 200,
//   trickle: true,
//   trickleSpeed: 200,
//   minimum: 0.08
// })
function onSetGlobalData() {
  return new Promise(async (resolve, reject) => {
    const storeAuthenticate = stores.authenticate()
    // if (storeAuthenticate.user) {
    // if (!store.state.types.all || !store.state.types.all.length) await store.dispatch('types/getAll')// .then(() => { console.log(store.state.types.items) })
    // if (!store.state.configs.instant || !store.state.configs.instant.length) await store.dispatch('configs/getAll')
    // }
    return resolve(true)
  })
}

const whiteList = ['/login'] // no redirect whitelist
Router.beforeEach(async (to, from, next) => {
  const storeAuthenticate = stores.authenticate()
  // console.log(to)
  // start progress bar
  // NProgress.start()
  // await onSetGlobalData()

  // const token = storeAuthenticate.token
  if (storeAuthenticate.isVerify) {
    // const a = await storeAuthenticate.verify({ token: token })
    // console.log(a)
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      // NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      if (storeAuthenticate.user) {
        next()
      } else {
        try {
          // get user info
          const rs = await storeAuthenticate.verify()//.then(() => {
          // next(to.path)
          // next({ path: to.path, params: to.params, query: to.query })
          // })
          if (rs) next({ path: to.path, query: to.query })//, params: to.params,
          else {
            storeAuthenticate.logout()
            // next()
            next(`/login?redirect=${to.path}`)
          }
          // if (!data.user) store.dispatch('auth/logout') // || !data.routes.length
          // if (!store.state.userSetting.data) {
          //   const us = await userSetting.get()
          //   store.dispatch('userSetting/set', us)
          // }
          // store
          //   .dispatch('auth/login', { user: data.user, routes: data.routes })
          //   .then(
          //     addRoutes(storeAuthenticate.routes, {
          //       replace: true
          //     })
          //   )
          //   .then(next(to.path)) // next({ ...to, replace: true })
        } catch (e) {
          // console.log(err)
          // remove token and go to login page to re-login
          await storeAuthenticate.logout()
          // Message.error(error || 'Has Error')
          // console.log(err)
          next(`/login?redirect=${to.path}`)
          // stop progress bar
          // NProgress.done()
        }
      }
      // // Check is added routes
      // if (storeAuthenticate.isAddRouter) {
      //   store.commit('auth/SET_IS_ADD_ROUTER', false)
      //   // dynamically add accessible routes
      //   // console.log(storeAuthenticate.routes)
      //   // console.log(store.getters.routes)
      //   addRoutes(storeAuthenticate.routes, { replace: true })
      //   // add exception routes
      //   // addRoutes(routers.exception, { replace: true })

      //   // hack method to ensure that addRoutes is complete
      //   // set the replace: true, so the navigation will not leave a history record
      //   next({ ...to, replace: true })
      //   // next({ replace: true })
      // }
    }
  } else {
    // has no token
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      // NProgress.done()
    }
  }
  pageTitle(to, from)
})

// Router.afterEach(() => {
// finish progress bar
// NProgress.done()
// })
