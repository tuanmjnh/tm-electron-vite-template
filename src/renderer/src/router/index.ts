import type { App } from 'vue'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { routes } from './routes.inner'
import { setupRouterGuard } from './guard'

const { RENDERER_VITE_ROUTE_MODE = 'hash', RENDERER_VITE_ROUTER_BASE } = import.meta.env
export const router = createRouter({
  history: RENDERER_VITE_ROUTE_MODE === 'hash' ? createWebHashHistory(RENDERER_VITE_ROUTER_BASE) : createWebHistory(RENDERER_VITE_ROUTER_BASE),
  routes,
})
// Install Vue Router
export async function installRouter(app: App) {
  // Adding a route guard
  setupRouterGuard(router)
  app.use(router)
  await router.isReady() // https://router.vuejs.org/zh/api/index.html#isready
}
