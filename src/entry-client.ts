import { asyncDataFilter, createApp, routerLoginInterceptor } from './main'
import airbnb from './db' // 引入数据库和对象仓库

const { app, router, store } = createApp()

routerLoginInterceptor(router)

if ((window as any).__INITIAL_STATE__) {
  store.replaceState((window as any).__INITIAL_STATE__)
}

// 在页面刷新时将vuex里的信息保存到sessionStorage里
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('store', JSON.stringify(store.state))
})

const storeSession = sessionStorage.getItem('store')
if (storeSession) {
  store.replaceState(Object.assign(store.state, JSON.parse(storeSession)))
}

// if ((window as any).__INITIAL_STATE__) {
//   store.replaceState((window as any).__INITIAL_STATE__)
// }

const language = localStorage.getItem('localeLanguageStore')
if (language) {
  store.commit('setLanguage', language)
}

airbnb.airbnbDB
  .openStore({
    ...airbnb.languageObjectStore,
    ...airbnb.userObjectStore,
    ...airbnb.orderObjectStore,
    ...airbnb.recordObjectStore
  })
  .then((res: any) => {
    console.log('初始化所有对象仓库', res)
    localStorage.getItem('userId') && store.commit('setUserStatus', 1)
  })
  .catch(e => {
    console.error(e)
  })

router.isReady().then(() => {
  router.beforeResolve((to, from, next) => {
    const toComponents = router
      .resolve(to)
      .matched.flatMap((record: any) => Object.values(record.components))
    const fromComponents = router
      .resolve(from)
      .matched.flatMap((record: any) => Object.values(record.components))

    const actived = toComponents.filter((c, i) => {
      return fromComponents[i] !== c
    })

    if (!actived.length) {
      return next()
    }
    console.log('开始loading。。。。。')
    asyncDataFilter(actived, store, router.currentRoute).then(() => {
      console.log('结束loading。。。。。')
      next()
    })
  })

  app.mount('#app')
})

router.afterEach(to => {
  const { roomDetail } = store.state
  const { title: roomTitle = '', owner } = roomDetail || {}
  const { introduce = '' } = owner || {}
  const { meta } = to
  const { title, keywords, description } = meta
  if (title) {
    document.title = `${title}${roomTitle}`
  } else {
    document.title = ''
  }

  const keywordsMeta = document.querySelector('meta[name="keywords"]')
  keywordsMeta?.setAttribute('content', `${keywords}${introduce}`)

  const descriptionMeta = document.querySelector('meta[name="description"]')
  descriptionMeta?.setAttribute('content', `${description}${introduce}`)
})
