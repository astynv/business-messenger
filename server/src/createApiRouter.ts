import { Router } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import { MikroORM, RequestContext } from '@mikro-orm/core'

import WebSocketController from './WebSocketController'

import TestApi from './api/TestApi'
import UserApi from './api/UserApi'
import ChatApi from './api/ChatApi'
import TodoApi from './api/TodoApi'

export default function createApiRouter (orm: MikroORM, wsc: WebSocketController): Router {
  const apiRouter = Router()

  apiRouter.use(cookieParser())
  apiRouter.use(bodyParser.json())

  apiRouter.use((req, res, next) => {
    RequestContext.create(orm.em, next)
  })

  // гасим Promise returned in function argument where a void return was expected.
  // потому что внатуре параллельно
  /* eslint-disable @typescript-eslint/no-misused-promises */

  const testApi = new TestApi(wsc)
  apiRouter.get('/test', testApi.get)
  apiRouter.post('/test', testApi.post)

  const userApi = new UserApi(wsc)
  apiRouter.get('/user', userApi.get)
  apiRouter.get('/findUsers', userApi.find)
  apiRouter.post('/user', userApi.postRegister)
  apiRouter.post('/auth', userApi.postLogin)

  const chatApi = new ChatApi(wsc)
  apiRouter.get('/chat', chatApi.get)
  apiRouter.get('/chats', chatApi.getAll)
  apiRouter.post('/chat', chatApi.create)
  apiRouter.post('/message', chatApi.sendMessage)
  apiRouter.post('/readMessage', chatApi.readMessage)
  apiRouter.get('/messages', chatApi.getMessages)

  const todoApi = new TodoApi(wsc)
  apiRouter.post('/todo', todoApi.create)
  apiRouter.post('/todoChangeCompletion', todoApi.changeCompletion)

  return apiRouter
}
