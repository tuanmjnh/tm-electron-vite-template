import type { App } from 'vue'
import AppVue from './App.vue'
import AppLoading from './components/common/AppLoading.vue'
import { installRouter } from '@/router'
import { installPinia } from '@/store'

async function setupApp() {
  // Load the global loading status
  const appLoading = createApp(AppLoading)
  appLoading.mount('#appLoading')

  // Create a Vue instance
  const app = createApp(AppVue)

  // Registration module Pinia
  await installPinia(app)

  // Register Module Vue-router
  await installRouter(app)

  // Register module directive/static resource
  Object.values(import.meta.glob<{ install: (app: App) => void }>('./modules/*.ts', { eager: true })).map(i => app.use(i))

  // Unloading animation
  appLoading.unmount()

  // Mount
  app.mount('#app')
}

setupApp()
