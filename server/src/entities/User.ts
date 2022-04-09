import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  Property
} from '@mikro-orm/core'
import PublicUser from '../common/types/PublicUser'

import BaseEntity from './BaseEntity'
import Chat from './Chat'
import Todo from './Todo'
import Token from './Token'

export interface UserProps {
  username: string
  email: string
  passwordHash: string
  firstName: string
  lastName: string
}

@Entity()
export default class User extends BaseEntity {
  @Property()
  username: string

  @Property()
  email: string

  @Property()
  passwordHash: string

  @Property()
  firstName: string

  @Property()
  lastName: string

  @OneToMany(() => Token, 'user')
  tokens = new Collection<Token>(this)

  @ManyToMany(() => Chat)
  chats = new Collection<Chat>(this)

  @OneToMany(() => Todo, 'assigned')
  todos = new Collection<Todo>(this)

  @Property()
  lastSeen = new Date()

  @Property()
  avatar?: Buffer

  constructor ({
    username,
    email,
    passwordHash,
    firstName,
    lastName
  }: UserProps) {
    super()

    this.username = username

    this.email = email
    this.passwordHash = passwordHash

    this.firstName = firstName
    this.lastName = lastName
  }

  toPublic (): PublicUser {
    return {
      id: this.id,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      lastSeen: this.lastSeen
    }
  }
}
