import http from 'http'
import url from 'url'
import path from 'path'
import { MikroORM } from '@mikro-orm/core'
import express, {
  Express
} from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import ws from 'ws'

import entities from './entities/index'
import createApiRouter from './createApiRouter'
import WebSocketController from './WebSocketController'

const port = process.env.PORT ?? 5000
const proxyFrontend = process.env.FRONTEND === 'dev'
const mongoUrl = process.env.MONGO_URL

const indexDir = path.join(__dirname, '../../build')
const indexFile = path.join(__dirname, '../../build/index.html')

;(async () => {
  // database
  const orm = await MikroORM.init({
    type: 'mongo',
    clientUrl: mongoUrl,
    entities
  })

  // websocket server & controller
  const wss = new ws.Server({ noServer: true })
  const wsc = new WebSocketController(orm)

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  wss.on('connection', wsc.handleConnection)

  // web server
  const app: Express = express()

  // use custom node server for harvesting websockets
  const server = http.createServer(app)
  app.listen = (...args: any[]) => server.listen(...args)

  // inject websocket harvester
  server.on('upgrade', (request, socket, head) => {
    const { pathname } = new url.URL(request.url, 'http://localhost')

    if (pathname === '/api') {
      wss.handleUpgrade(request, socket, head, function done (ws) {
        wss.emit('connection', ws, request)
      })
    }
  })

  // connect http api
  const apiRouter = createApiRouter(orm, wsc)
  app.use('/api', apiRouter)

  // фронтенд
  if (proxyFrontend) {
    // прокси на create-react-app дев сервер
    app.use(createProxyMiddleware('http://localhost:3000', { ws: true }))
  } else {
    // статичный хостинг собранного фронта
    app.use(express.static(indexDir))
    app.get('*', (req, res) => {
      res.sendFile(indexFile)
    })
  }

  app.listen(port, () => {
    console.log(`Messenger server is listening on http://localhost:${port}`)
  })
})().catch(e => console.log(e))
