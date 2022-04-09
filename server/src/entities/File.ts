import {
  Entity,
  Enum,
  ManyToOne,
  Property
} from '@mikro-orm/core'

import BaseEntity from './BaseEntity'
import User from './User'

import FileType from '../common/types/FileType'

export interface FileProps {
  title: string
  type: FileType
  owner: User
  body: Buffer
}

@Entity()
export default class File extends BaseEntity {
  @Property()
  title: string

  @Enum()
  type: FileType

  @ManyToOne(() => User)
  owner: User

  @Property()
  uploaded: Date = new Date()

  @Property()
  body: Buffer

  constructor ({
    title,
    type,
    owner,
    body
  }: FileProps) {
    super()

    this.title = title
    this.type = type
    this.owner = owner
    this.body = body
  }
}
