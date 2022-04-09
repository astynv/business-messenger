import GenericController from './GenericController'
import { Token, User } from '../entities'

export default class TokenController extends GenericController {
  async issue (user: User, userAgent: string): Promise<Token> {
    // create
    const token = new Token({
      user,
      userAgent
    })
    this.em.persist(token)

    // tie to user
    user.tokens.add(token)

    // save
    await this.em.flush()

    return token
  }
}
