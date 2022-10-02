import { createSSRApp } from 'vue'
import App from './App.vue'
import { createSSRRouter } from './router'
import ElementPlus, { ElMessage, ID_INJECTION_KEY } from 'element-plus'
import 'element-plus/dist/index.css'
import { createSSRI18n } from './language/i18n'
import { createSSRStore, key } from './store'
import 'default-passive-events'
import type { Router } from 'vue-router'
import { useRegisterSW } from 'virtual:pwa-register/vue'

if (!import.meta.env.SSR) {
  useRegisterSW()
}

export function createApp() {
  const app = createSSRApp(App)
  const store = createSSRStore()
  const router = createSSRRouter()
  const i18n = createSSRI18n()

  app.config.globalProperties.$message = ElMessage
  app.use(store, key)
  app.use(router)
  app.provide(ID_INJECTION_KEY, {
    prefix: Math.floor(Math.random() * 10000),
    current: 0
  })
  app.use(ElementPlus)
  app.use(i18n)
  return { app, router, store }
}

export function asyncDataFilter(actived: any, store: any, route: any) {
  return Promise.all(
    actived.map((Component: any) => {
      if (Component.asyncData) {
        return Component.asyncData({
          store,
          route
        })
      }
    })
  )
}

export function routerLoginInterceptor(
  router: Router,
  token?: string,
  redirect?: any
) {
  router.beforeEach((to, from, next) => {
    if (
      to.name !== 'login' &&
      to.meta.requiresAuth &&
      !(import.meta.env.SSR ? token : localStorage.getItem('userId'))
    ) {
      if (redirect) {
        redirect.url = `/login?redirect=${to.path}`
      }
      next({
        path: '/login',
        query: {
          redirect: to.path
        }
      })
    } else {
      next()
    }
  })
}
