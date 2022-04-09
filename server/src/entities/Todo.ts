import {
  Entity,
  ManyToOne,
  Property
} from '@mikro-orm/core'
import PublicTodo from '../common/types/PublicTodo'

import BaseEntity from './BaseEntity'
import Chat from './Chat'
import User from './User'

export interface TodoProps {
  chat: Chat
  title: string
  description?: string
  assigned?: User
}

@Entity()
export default class Todo extends BaseEntity {
  @ManyToOne(() => Chat)
  chat: Chat

  @Property()
  title: string

  @Property()
  description?: string

  @ManyToOne(() => User)
  assigned?: User

  @Property()
  completed: boolean = false

  constructor ({
    chat,
    title,
    description,
    assigned
  }: TodoProps) {
    super()

    this.chat = chat
    this.title = title
    this.description = description
    this.assigned = assigned
  }

  toPublic (): PublicTodo {
    return {
      id: this.id,
      title: this.title,
      completed: this.completed,
      description: this.description
    }
  }
}
