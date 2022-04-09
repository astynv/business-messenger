import { EntityManager } from '@mikro-orm/core'

import WebSocketController from './WebSocketController'

import TestController from './controllers/TestController'
import TokenController from './controllers/TokenController'
import UserController from './controllers/UserController'
import ChatController from './controllers/ChatController'

export default class EntityControllers {
  em: EntityManager
  wsc: WebSocketController

  Test: TestController
  User: UserController
  Token: TokenController
  Chat: ChatController

  constructor (em: EntityManager, wsc: WebSocketController) {
    this.em = em
    this.wsc = wsc

    this.Test = new TestController(em, wsc)
    this.User = new UserController(em, wsc)
    this.Token = new TokenController(em, wsc)
    this.Chat = new ChatController(em, wsc)
  }
}
