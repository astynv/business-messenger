import {
  Request,
  Response
} from 'express'

import GenericApi from './GenericApi'

import NewUser, { isNewUser } from '../common/types/NewUser'
import Login, { isLogin } from '../common/types/Login'

import { User } from '../entities'
import EntityControllers from '../EntityControllers'

export default class UserApi extends GenericApi {
  get = async (req: Request, res: Response): Promise<void> => {
    const ec = this.getEntityControllers()

    const user = await GenericApi.getUser(ec, req, res)

    if (user === null) {
      res.status(401)
      res.json({
        message: 'unauthorized'
      })
      return
    }

    res.json(user.toPublic())
  }

  postRegister = async (req: Request, res: Response): Promise<void> => {
    const ec = this.getEntityControllers()

    const { body } = req

    // input validation
    const [valid, reason] = isNewUser(body)

    if (!valid) {
      res.status(400)
      res.json({
        message: reason
      })
      return
    }
    const newUser = body as NewUser

    // check if is duplicate
    const [
      emailDuplicate,
      usernameDuplicate
    ] = await Promise.all([
      ec.User.getByEmail(newUser.email),
      ec.User.getByUsername(newUser.username)
    ])

    if (emailDuplicate !== null) {
      res.status(400)
      res.json({
        message: 'user with such email already exists'
      })
      return
    }

    if (usernameDuplicate !== null) {
      res.status(400)
      res.json({
        message: 'user with such username already exists'
      })
      return
    }

    // save to DB
    const user = await ec.User.create(newUser)

    // issue token
    await UserApi.login(ec, user, newUser, res)

    res.json(user.toPublic())
  }

  postLogin = async (req: Request, res: Response): Promise<void> => {
    const ec = this.getEntityControllers()

    const { body } = req

    // input validation
    const [valid, reason] = isLogin(body)

    if (!valid) {
      res.status(400)
      res.json({
        message: reason
      })
      return
    }
    const login = body as Login

    const user = await ec.User.getByEmailAndPassword(login.email, login.password)

    if (user === null) {
      res.status(400)
      res.json({
        message: 'wrong email or password'
      })
      return
    }

    // issue token
    await UserApi.login(ec, user, login, res)

    res.json(user.toPublic())
  }

  find = async (req: Request, res: Response): Promise<void> => {
    const ec = this.getEntityControllers()

    if (
      req.query.q === undefined ||
      typeof req.query.q !== 'string' ||
      req.query.q === ''
    ) {
      res.status(400)
      res.json({
        message: 'provide valid query param \'q\''
      })
      return
    }

    const users = await ec.User.find(req.query.q)

    res.json(users.map(user => user.toPublic()))
  }

  // utils

  static login = async (ec: EntityControllers, user: User, credentials: NewUser | Login, res: Response): Promise<void> => {
    const token = await ec.Token.issue(user, credentials.userAgent)

    res.cookie(
      'token',
      token.token,
      {
        sameSite: 'strict',
        maxAge: 6 * 30 * 24 * 3600 * 1000 // 6 months
      }
    )
  }
}
