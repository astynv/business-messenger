import { RequestContext } from '@mikro-orm/core'
import {
  Request,
  Response
} from 'express'

import { User } from '../entities'
import EntityControllers from '../EntityControllers'
import WebSocketController from '../WebSocketController'

export default abstract class GenericApi {
  wsc: WebSocketController

  constructor (wsc: WebSocketController) {
    this.wsc = wsc
  }

  protected getEntityControllers (): EntityControllers {
    const em = RequestContext.getEntityManager()

    if (em === undefined) {
      throw new Error('RequestContext.getEntityManager() returned undefined')
    }

    return new EntityControllers(em, this.wsc)
  }

  protected static async getUser (ec: EntityControllers, req: Request, res: Response): Promise<User | null> {
    const token: string | undefined = req.cookies.token

    if (token === undefined) {
      return null
    }

    const user = await ec.User.getByToken(token)

    if (user === null) {
      res.clearCookie('token')
    }

    return user
  }
}
