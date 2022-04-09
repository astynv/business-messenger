import bcrypt from 'bcrypt'

import GenericController from './GenericController'

import NewUser from '../common/types/NewUser'

import { Token, User } from '../entities'

export default class UserController extends GenericController {
  async create (newUser: NewUser): Promise<User> {
    const passwordHash = await bcrypt.hash(newUser.password, 12)

    const user = new User({
      username: newUser.username,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      passwordHash
    })
    this.em.persist(user)

    await this.em.flush()

    return user
  }

  async getById (id: string): Promise<User | null> {
    return await this.em.findOne(User, { id })
  }

  async getByIds (ids: string[]): Promise<User[]> {
    return await this.em.find(User, { id: { $in: ids } })
  }

  async getByEmail (email: string): Promise<User | null> {
    return await this.em.findOne(User, { email })
  }

  async getByUsername (username: string): Promise<User | null> {
    return await this.em.findOne(User, { username })
  }

  async getByEmailAndPassword (email: string, password: string): Promise<User | null> {
    const user = await this.em.findOne(User, { email })

    if (user === null) {
      return user
    }

    const valid = await bcrypt.compare(password, user.passwordHash)

    return valid ? user : null
  }

  async getByToken (token: string): Promise<User | null> {
    const tokenEntity = await this.em.findOne(Token, { token }, { populate: true })

    if (tokenEntity === null) {
      return null
    }

    tokenEntity.user.lastSeen = new Date()
    await this.em.flush()

    return tokenEntity.user
  }

  async find (query: string): Promise<User[]> {
    const words = query
      .replace(/[^a-zа-яё0-9\s_-]/gi, '')
      .split(' ')
      .filter(word => word !== '')

    if (words.length === 0) {
      return []
    }

    const re = new RegExp(
      `.*(${words.join('|')}).*`,
      'i'
    )

    // да да пиздец но оказывается орм только так умеет
    const found = await Promise.all([
      this.em.find(User, { username: re }, { limit: 10 }),
      this.em.find(User, { firstName: re }, { limit: 10 }),
      this.em.find(User, { lastName: re }, { limit: 10 })
    ])

    const having = new Set<string>()

    const unique = found.map(
      arr => arr.filter(user => {
        if (having.has(user.id)) {
          return false
        } else {
          having.add(user.id)
          return true
        }
      })
    ).flat()

    return unique
  }
}
