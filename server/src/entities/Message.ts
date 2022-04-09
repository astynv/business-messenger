import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  Property
} from '@mikro-orm/core'

import BaseEntity from './BaseEntity'
import Chat from './Chat'
import File from './File'
import User from './User'

import MessageType from '../common/types/MessageType'
import ViewedMessage from '../common/types/ViewedMessage'

export interface MessageProps {
  chat: Chat
  sender: User
  type: MessageType
  text?: string
}

@Entity()
export default class Message extends BaseEntity {
  @ManyToOne(() => Chat)
  chat: Chat

  @Property()
  date: Date = new Date()

  @ManyToOne(() => User)
  sender: User

  @Enum()
  type: MessageType

  @ManyToMany(() => File)
  attachments = new Collection<File>(this)

  @ManyToMany(() => User)
  readBy = new Collection<User>(this)

  @Property()
  text?: string

  constructor ({
    chat,
    sender,
    type,
    text
  }: MessageProps) {
    super()

    this.chat = chat
    this.sender = sender
    this.type = type
    this.text = text
  }

  async toViewed (as?: User): Promise<ViewedMessage> {
    return {
      id: this.id,
      date: this.date,
      sender: {
        id: this.sender.id,
        name: this.sender.firstName + ' ' + this.sender.lastName
      },
      type: this.type,
      attachments: [], // todo
      read: as === undefined
        ? false
        : as !== this.sender
          // user is among ones who've read
          ? (await this.readBy.init()).contains(as)
          // someone has read it
          : (await this.readBy.loadItems()).some(user => user !== as),
      text: this.text
    }
  }
}
