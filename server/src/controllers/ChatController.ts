import GenericController from './GenericController'
import { Chat, File, Message, Todo, User } from '../entities'
import NewChat from '../common/types/NewChat'
import MessageType from '../common/types/MessageType'
import { QueryOrder } from '@mikro-orm/core'
import NewMessage from '../common/types/NewMessage'
import NewTodo from '../common/types/NewTodo'

export default class ChatController extends GenericController {
  async create (creator: User, newChat: NewChat, users: User[]): Promise<Chat> {
    const chat = new Chat({
      direct: newChat.direct,
      title: newChat.title ?? `Chat of ${users.map(
        ({ firstName, lastName }) => firstName + ' ' + lastName
      ).join(', ')}`
    })
    this.em.persist(chat)

    chat.members.add(...users)

    // send message about chat's creation
    await this.sendServiceMessage(chat, creator, MessageType.CREATED)
    // implicit flush by sendServiceMessage

    await this.wsc.broadcastChatCreation(chat, creator)

    return chat
  }

  async getUserDialogs (user: User): Promise<Chat[]> {
    // await this.em.populate(user, 'chats')

    return []
  }

  async sendServiceMessage (chat: Chat, source: User, type: MessageType): Promise<void> {
    const message = new Message({
      chat,
      sender: source,
      type
    })
    chat.messages.add(message)
    message.readBy.add(source)

    await this.em.flush()

    // eslint-disable-next-line no-void
    void this.wsc.broadcastNewMessage(message)
  }

  async sendMessage (chat: Chat, sender: User, newMessage: NewMessage): Promise<Message> {
    const message = new Message({
      chat,
      sender,
      type: MessageType.DEFAULT,
      text: newMessage.text
    })

    if (newMessage.attachmentsIds !== undefined) {
      const attachments = await this.em.find(File, { id: { $in: newMessage.attachmentsIds } })

      message.attachments.add(...attachments)
    }

    chat.messages.add(message)
    message.readBy.add(sender)

    await this.em.flush()

    // eslint-disable-next-line no-void
    void this.wsc.broadcastNewMessage(message)

    return message
  }

  async tryReadMessage (user: User, messageId: string): Promise<boolean> {
    const message = await this.em.findOne(Message, { id: messageId })

    if (message === null) {
      return false
    }

    const members = await message.chat.members.init()

    if (!members.contains(user)) {
      console.log('ss')
      return false
    }

    const earlier = await message.chat.messages.init({
      where: {
        date: { $lte: message.date }
      },
      orderBy: { date: QueryOrder.DESC }
    })

    // i'm sorry
    for (const message of earlier.getItems()) {
      if (message.sender !== user && message.readBy.contains(user)) {
        break
      }

      message.readBy.add(user)
    }

    await this.em.flush()

    // eslint-disable-next-line no-void
    void this.wsc.broadcastReadMessage(message, user)

    return true
  }

  async getById (chatId: string): Promise<Chat | null> {
    return await this.em.findOne(Chat, { id: chatId })
  }

  async getMessagesPage (chat: Chat, page: number): Promise<Message[]> {
    const pageSize = 20

    const messages = await chat.messages.init({
      orderBy: { date: QueryOrder.DESC }
    })

    return messages.getItems().slice(pageSize * page, pageSize * (page + 1))
  }

  async getLastMessage (chat: Chat): Promise<Message> {
    const messages = await chat.messages.init({
      orderBy: { date: QueryOrder.DESC }
    })

    return messages[0]
  }

  async getUnreadCount (chat: Chat, forUser: User): Promise<number> {
    // 1+N !!! pizdeccccc

    const messages = await chat.messages.init({
      orderBy: { date: QueryOrder.DESC }
    })

    let count = 0

    for (const message of messages) {
      if (message.readBy.contains(forUser)) {
        break
      }

      count += 1
    }

    return count
  }

  async createTodo (creator: User, chat: Chat, newTodo: NewTodo): Promise<Todo> {
    const todo = new Todo({
      chat,
      title: newTodo.title,
      description: newTodo.description
    })

    chat.todos.add(todo)

    await this.sendServiceMessage(todo.chat, creator, MessageType.CREATED_TODO)
    // + implicit this.em.flush()

    // eslint-disable-next-line no-void
    void this.wsc.broadcastTodoCreation(todo, creator)

    return todo
  }

  async getTodoById (todoId: string): Promise<Todo | null> {
    return await this.em.findOne(Todo, { id: todoId })
  }

  async setTodoCompletion (user: User, todo: Todo, completed: boolean): Promise<void> {
    todo.completed = completed

    await this.sendServiceMessage(todo.chat, user, MessageType.CHANGED_TODO_COMPLETION)
    // + implicit this.em.flush()

    // eslint-disable-next-line no-void
    void this.wsc.broadcastTodoCompletion(todo, user)
  }
}
