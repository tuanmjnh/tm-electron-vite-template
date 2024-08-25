import type { RouteLocationNormalized } from 'vue-router'
import { router } from '@/router'

interface TabState {
  pinTabs: RouteLocationNormalized[]
  tabs: RouteLocationNormalized[]
  currentTabPath: string
}
export const useTabStore = defineStore('tab-store', {
  state: (): TabState => {
    return {
      pinTabs: [],
      tabs: [],
      currentTabPath: '',
    }
  },
  getters: {
    allTabs: state => [...state.pinTabs, ...state.tabs],
  },
  actions: {
    addTab(route: RouteLocationNormalized) {
      // Determine whether to add based on meta, can be used for error pages, login pages, etc.
      if (route.meta.withoutTab)
        return

      // Do not add if the tag name already exists
      if (this.hasExistTab(route.path as string))
        return

      // Pass to different groups based on meta.pinTab
      if (route.meta.pinTab)
        this.pinTabs.push(route)
      else
        this.tabs.push(route)
    },
    async closeTab(path: string) {
      const tabsLength = this.tabs.length
      // If the number of dynamic tabs is greater than one, the tab will jump
      if (this.tabs.length > 1) {
        // Get the closed tab index
        const index = this.getTabIndex(path)
        const isLast = index + 1 === tabsLength
        // If the current page is closed, the route jumps to the next tab of the original tab
        if (this.currentTabPath === path && !isLast) {
          // Jump to the next tab
          router.push(this.tabs[index + 1].path)
        }
        else if (this.currentTabPath === path && isLast) {
          // It's already the last one, so jump to the previous one
          router.push(this.tabs[index - 1].path)
        }
      }
      // Delete tab
      this.tabs = this.tabs.filter((item) => {
        return item.path !== path
      })
      // If it is cleared after deletion, jump to the default homepage
      if (tabsLength - 1 === 0)
        router.push('/')
    },

    closeOtherTabs(path: string) {
      const index = this.getTabIndex(path)
      this.tabs = this.tabs.filter((item, i) => i === index)
    },
    closeLeftTabs(path: string) {
      const index = this.getTabIndex(path)
      this.tabs = this.tabs.filter((item, i) => i >= index)
    },
    closeRightTabs(path: string) {
      const index = this.getTabIndex(path)
      this.tabs = this.tabs.filter((item, i) => i <= index)
    },
    clearAllTabs() {
      this.tabs.length = 0
      this.pinTabs.length = 0
    },
    closeAllTabs() {
      this.tabs.length = 0
      router.push('/')
    },

    hasExistTab(path: string) {
      const _tabs = [...this.tabs, ...this.pinTabs]
      return _tabs.some((item) => {
        return item.path === path
      })
    },
    /* Set the currently active tab */
    setCurrentTab(path: string) {
      this.currentTabPath = path
    },
    getTabIndex(path: string) {
      return this.tabs.findIndex((item) => {
        return item.path === path
      })
    },
  },
  persist: {
    storage: sessionStorage,
  },
})
