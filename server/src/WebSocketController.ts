import ws from 'ws'
import { MikroORM } from '@mikro-orm/core'

import WebSocketMessage, {
  isWebSocketMessage,
  WebSocketMessageType,
  ConnectionRejectedMessage,
  ConnectionConfirmedMessage,
  BroadcastableMessage,
  NewMessageMessage,
  MessageReadMessage,
  NewChatMessage,
  NewTodoMessage,
  TodoCompletionChangeMessage
} from './common/types/WebSocketMessage'
import toWSMessages from './utils/toWSMessages'
import { Chat, Message, Todo, Token, User } from './entities'
import ChatItem from './common/types/ChatItem'

export default class WebSocketController {
  orm: MikroORM
  subscribers = new Map<string, ws[]>()

  constructor (orm: MikroORM) {
    this.orm = orm
  }

  handleConnection = async (ws: ws): Promise<void> => {
    const iter = toWSMessages(ws)

    let userId: string | null = null

    for await (const [str, ws] of iter) {
      const em = this.orm.em.fork()

      try {
        const msg: WebSocketMessage = JSON.parse(str)

        const [valid, reason] = isWebSocketMessage(msg)

        if (!valid) {
          const message: ConnectionRejectedMessage = {
            type: WebSocketMessageType.CONNECTION_REJECTED,
            reason: reason ?? ''
          }

          throw new Error(JSON.stringify(message))
        }

        if (msg.type !== WebSocketMessageType.CONNECT_REQUEST) {
          const message: ConnectionRejectedMessage = {
            type: WebSocketMessageType.CONNECTION_REJECTED,
            reason: 'you only can use WebSocketMessageType.CONNECT_REQUEST'
          }

          throw new Error(JSON.stringify(message))
        }

        const token = await em.findOne(Token, { token: msg.token })

        if (token === null) {
          const message: ConnectionRejectedMessage = {
            type: WebSocketMessageType.CONNECTION_REJECTED,
            reason: 'invalid token'
          }

          throw new Error(JSON.stringify(message))
        }

        userId = token.user.id
        this.subscribe(userId, ws)

        const message: ConnectionConfirmedMessage = {
          type: WebSocketMessageType.CONNECTION_CONFIRMED
        }

        ws.send(JSON.stringify(message))
      } catch (e) {
        ws.send(e.message)
      }
    }

    // client disconnected
    if (userId !== null) {
      this.unsubscribe(userId, ws)
    }
  }

  private subscribe (userId: string, ws: ws): void {
    if (this.subscribers.has(userId)) {
      this.subscribers.get(userId)?.push(ws)
    } else {
      this.subscribers.set(userId, [ws])
    }
  }

  private unsubscribe (userId: string, ws: ws): void {
    if (this.subscribers.has(userId)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const newSubs = this.subscribers.get(userId)!.filter(
        oldSocket => oldSocket !== ws
      )

      if (newSubs.length === 0) {
        this.subscribers.delete(userId)
      } else {
        this.subscribers.set(userId, newSubs)
      }
    }
  }

  private broadcast (chat: Chat, message: BroadcastableMessage): void {
    const members = chat.members.getItems()

    members.forEach(member => {
      if (member.id !== message.emitentId && this.subscribers.has(member.id)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.subscribers.get(member.id)!.forEach(
          ws => ws.send(JSON.stringify(message))
        )
      }
    })
  }

  async broadcastNewMessage (message: Message): Promise<void> {
    const wsMessage: NewMessageMessage = {
      type: WebSocketMessageType.NEW_MESSAGE,
      chatId: message.chat.id,
      emitentId: message.sender.id,
      message: await message.toViewed()
    }

    this.broadcast(
      message.chat,
      wsMessage
    )
  }

  async broadcastReadMessage (message: Message, by: User): Promise<void> {
    const wsMessage: MessageReadMessage = {
      type: WebSocketMessageType.READ_MESSAGE,
      chatId: message.chat.id,
      emitentId: by.id,
      messageId: message.id
    }

    this.broadcast(
      message.chat,
      wsMessage
    )
  }

  async broadcastChatCreation (chat: Chat, by: User): Promise<void> {
    const chatItem: ChatItem = {
      id: chat.id,
      title: chat.title,
      unreadCount: 1,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      lastMessage: await chat.messages[0].toViewed(by)
    }

    const wsMessage: NewChatMessage = {
      type: WebSocketMessageType.NEW_CHAT,
      emitentId: by.id,
      chat: chatItem
    }

    this.broadcast(
      chat,
      wsMessage
    )
  }

  async broadcastTodoCreation (todo: Todo, by: User): Promise<void> {
    const publicTodo = todo.toPublic()

    const wsMessage: NewTodoMessage = {
      type: WebSocketMessageType.NEW_TODO,
      emitentId: by.id,
      chatId: todo.chat.id,
      todo: publicTodo
    }

    this.broadcast(
      todo.chat,
      wsMessage
    )
  }

  async broadcastTodoCompletion (todo: Todo, by: User): Promise<void> {
    const publicTodo = todo.toPublic()

    const wsMessage: TodoCompletionChangeMessage = {
      type: WebSocketMessageType.TODO_COMPLETION_CHANGE,
      emitentId: by.id,
      chatId: todo.chat.id,
      todo: publicTodo
    }

    this.broadcast(
      todo.chat,
      wsMessage
    )
  }
}
