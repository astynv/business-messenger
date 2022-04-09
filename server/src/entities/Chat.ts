import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  Property
} from '@mikro-orm/core'

import PublicChat from '../common/types/PublicChat'

import BaseEntity from './BaseEntity'
import File from './File'
import Message from './Message'
import Todo from './Todo'
import User from './User'

export interface ChatProps {
  direct: boolean
  title?: string
}

@Entity()
export default class Chat extends BaseEntity {
  @Property()
  direct: boolean

  @ManyToMany(() => User, 'chats')
  members = new Collection<User>(this)

  @OneToMany(() => Message, 'chat')
  messages = new Collection<Message>(this)

  @ManyToMany(() => File)
  attachments = new Collection<File>(this)

  @OneToMany(() => Todo, 'chat')
  todos = new Collection<Todo>(this)

  @Property()
  title?: string

  @Property()
  avatar?: Buffer

  constructor ({ direct, title }: ChatProps) {
    super()

    this.direct = direct
    this.title = title
  }

  toPublic (): PublicChat {
    return {
      id: this.id,
      direct: this.direct,
      members: this.members.getItems().map(user => user.toPublic()),
      title: this.title,
      todos: this.todos.getItems().map(todo => todo.toPublic())
    }
  }
}
