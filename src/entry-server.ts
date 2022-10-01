import { createApp, asyncDataFilter, routerLoginInterceptor } from './main'
import { renderToString } from 'vue/server-renderer'
import { basename } from 'node:path'

export async function render(
  url: string,
  manifest: any,
  token: string,
  redirect: any
) {
  const { app, router, store } = createApp()

  routerLoginInterceptor(router, token, redirect)
  await router.push(url)
  await router.isReady()

  const { currentRoute } = router
  const matchedComponents = currentRoute.value.matched.flatMap((record: any) =>
    Object.values(record.components)
  )
  // console.log('匹配组件', matchedComponents)
  // 对所有匹配的路由组件调用 `asyncData()`
  await asyncDataFilter(matchedComponents, store, currentRoute)
  const context: any = {}
  const appHtml = await renderToString(app, context)
  const state = store.state
  if (import.meta.env.PROD) {
    const preloadLinks = renderLinks(context.modules, manifest)
    return { appHtml, state, preloadLinks, currentRoute: currentRoute.value }
  } else {
    return { appHtml, state, currentRoute: currentRoute.value }
  }
}

function renderLinks(modules: any, manifest: any) {
  let links = ''
  const seen = new Set()
  modules.forEach((id: any) => {
    const files = manifest[id]
    if (files) {
      files.forEach((file: any) => {
        if (!seen.has(file)) {
          seen.add(file)
          const filename = basename(file)
          if (manifest[filename]) {
            for (const depFile of manifest[filename]) {
              links += renderPreloadLink(depFile)
              seen.add(depFile)
            }
          }
          links += renderPreloadLink(file)
        }
      })
    }
  })
  return links
}

function renderPreloadLink(file: any) {
  if (file.endsWith('.js')) {
    return `<link rel="modulepreload" crossorigin href="${file}">`
  } else if (file.endsWith('.css')) {
    return `<link rel="stylesheet" href="${file}">`
  } else if (file.endsWith('.woff')) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
  } else if (file.endsWith('.woff2')) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
  } else if (file.endsWith('.gif')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/gif">`
  } else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`
  } else if (file.endsWith('.png')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/png">`
  } else {
    // TODO
    return ''
  }
}
