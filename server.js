import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cookieParser from 'cookie-parser'

export default async function createServer() {
  const isProd = process.env.NODE_ENV === 'production'
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const resolve = p => path.resolve(__dirname, p)

  const indexProd = isProd
    ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
    : ''

  const manifest = isProd
    ? (
        await import('./dist/client/ssr-manifest.json', {
          assert: { type: 'json' }
        })
      ).default
    : {}

  const app = express()
  app.use(cookieParser())

  let vite
  if (!isProd) {
    vite = await (
      await import('vite')
    ).createServer({
      server: {
        middlewareMode: true
      },
      appType: 'custom'
    })
    app.use(vite.middlewares)
  } else {
    app.use((await import('compression')).default())
    app.use(
      (await import('serve-static')).default(resolve('dist/client'), {
        index: false
      })
    )
  }

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl
      let template, render
      if (!isProd) {
        template = fs.readFileSync(resolve('index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/entry-server.ts')).render
      } else {
        template = indexProd
        render = (await import('./dist/server/entry-server.js')).render
      }

      const token = req.cookies.token
      const redirect = {
        url: null
      }
      const { appHtml, state, preloadLinks, currentRoute } = await render(
        url,
        manifest,
        token,
        redirect
      )

      if (redirect.url) {
        res.redirect(redirect.url)
      } else {
        const { roomDetail } = state
        const { title: roomTitle = '', owner } = roomDetail || {}
        const { introduce = '' } = owner || {}
        const { meta } = currentRoute
        const { title, keywords, description } = meta

        const html = template
          .replace('<!--preload-links-->', preloadLinks || '')
          .replace('<!--ssr-outlet-->', appHtml)
          .replace("'<!--vuex-state-->'", JSON.stringify(state))
          .replace(
            '<!--preload-title-->',
            `<title>${title}${roomTitle}</title>`
          )
          .replace(
            '<!--preload-meta-keywords-->',
            `<meta name="keywords" content="${keywords}${introduce}" />`
          )
          .replace(
            '<!--preload-meta-description-->',
            `<meta name="description" content="${description}${introduce}" />`
          )

        res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
      }
    } catch (e) {
      vite && vite.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })

  return { app }
}

createServer().then(({ app }) =>
  app.listen(3000, () => {
    console.log('http://localhost:3000')
  })
)
