import {
  Entity,
  Property
} from '@mikro-orm/core'

import BaseEntity from './BaseEntity'

@Entity()
export default class Test extends BaseEntity {
  @Property()
  title: string

  @Property()
  description: string

  constructor (title: string, description: string) {
    super()

    this.title = title
    this.description = description
  }
}
