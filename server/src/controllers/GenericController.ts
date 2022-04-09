import { EntityManager } from '@mikro-orm/core'
import WebSocketController from '../WebSocketController'

export default abstract class GenericController {
  em: EntityManager
  wsc: WebSocketController

  constructor (em: EntityManager, wsc: WebSocketController) {
    this.em = em
    this.wsc = wsc
  }
}
