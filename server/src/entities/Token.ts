import {
  Entity,
  ManyToOne,
  Property
} from '@mikro-orm/core'

import randomBase64 from '../utils/randomBase64'

import BaseEntity from './BaseEntity'
import User from './User'

export interface TokenProps {
  user: User
  userAgent: string
}

@Entity()
export default class Token extends BaseEntity {
  @ManyToOne(() => User)
  user: User

  @Property()
  userAgent: string

  @Property()
  token: string = randomBase64(32)

  @Property()
  issued: Date = new Date()

  constructor ({ user, userAgent }: TokenProps) {
    super()

    this.user = user
    this.userAgent = userAgent
  }
}
