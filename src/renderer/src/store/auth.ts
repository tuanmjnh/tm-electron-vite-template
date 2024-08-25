import { useRouteStore } from './router'
import { useTabStore } from './tab'
import { fetchLogin } from '@/service'
import { router } from '@/router'
import { local } from '@/utils'

interface AuthStatus {
  userInfo: Api.Login.Info | null
  token: string
}
export const useAuthStore = defineStore('auth-store', {
  state: (): AuthStatus => {
    return {
      userInfo: local.get('userInfo'),
      token: local.get('accessToken') || '',
    }
  },
  getters: {
    /** Are you logged in? */
    isLogin(state) {
      return Boolean(state.token)
    },
  },
  actions: {
    /* Log in and out, reset user information, etc. */
    async logout() {
      const route = unref(router.currentRoute)
      // Clear local cache
      this.clearAuthStorage()
      // Clear route, menu and other data
      const routeStore = useRouteStore()
      routeStore.resetRouteStore()
      // Clear tab bar data
      const tabStore = useTabStore()
      tabStore.clearAllTabs()
      // Reset current repository
      this.$reset()
      // Redirect to login page
      if (route.meta.requiresAuth) {
        router.push({
          name: 'login',
          query: {
            redirect: route.fullPath,
          },
        })
      }
    },
    clearAuthStorage() {
      local.remove('accessToken')
      local.remove('refreshToken')
      local.remove('userInfo')
    },

    /* User login */
    async login(userName: string, password: string) {
      try {
        const { isSuccess, data } = await fetchLogin({ userName, password })
        if (!isSuccess)
          return

        // Handling Login Information
        await this.handleLoginInfo(data)
      }
      catch (e) {
        console.warn('[Login Error]:', e)
      }
    },

    /* Processing the data returned by login */
    async handleLoginInfo(data: Api.Login.Info) {
      // Save token and userInfo
      local.set('userInfo', data)
      local.set('accessToken', data.accessToken)
      local.set('refreshToken', data.refreshToken)
      this.token = data.accessToken
      this.userInfo = data

      // Adding Routes and Menus
      const routeStore = useRouteStore()
      await routeStore.initAuthRoute()

      // Redirect jump
      const route = unref(router.currentRoute)
      const query = route.query as { redirect: string }
      router.push({
        path: query.redirect || '/',
      })
    },
  },
})
