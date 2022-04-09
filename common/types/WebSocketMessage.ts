import ChatItem from './ChatItem'
import PublicTodo from './PublicTodo'
import ViewedMessage from './ViewedMessage'

export enum WebSocketMessageType {
  CONNECT_REQUEST,
  CONNECTION_CONFIRMED,
  CONNECTION_REJECTED,
  NEW_MESSAGE,
  READ_MESSAGE,
  NEW_CHAT,
  NEW_TODO,
  TODO_COMPLETION_CHANGE
}

export interface ConnectMessage {
  type: WebSocketMessageType.CONNECT_REQUEST
  token: string
}

export interface ConnectionConfirmedMessage {
  type: WebSocketMessageType.CONNECTION_CONFIRMED
}

export interface ConnectionRejectedMessage {
  type: WebSocketMessageType.CONNECTION_REJECTED
  reason: string
}

// Broadcastable:

export interface NewMessageMessage {
  type: WebSocketMessageType.NEW_MESSAGE
  emitentId: string
  chatId: string

  message: ViewedMessage
}

export interface MessageReadMessage {
  type: WebSocketMessageType.READ_MESSAGE
  emitentId: string
  chatId: string

  messageId: string
}

export interface NewChatMessage {
  type: WebSocketMessageType.NEW_CHAT
  emitentId: string

  chat: ChatItem
}

export interface NewTodoMessage {
  type: WebSocketMessageType.NEW_TODO
  emitentId: string
  chatId: string

  todo: PublicTodo
}

export interface TodoCompletionChangeMessage {
  type: WebSocketMessageType.TODO_COMPLETION_CHANGE
  emitentId: string
  chatId: string

  todo: PublicTodo
}

export type BroadcastableMessage = (
  NewMessageMessage
  | MessageReadMessage
  | NewChatMessage
  | NewTodoMessage
  | TodoCompletionChangeMessage
)

type WebSocketMessage = (
  ConnectMessage
  | ConnectionConfirmedMessage
  | ConnectionRejectedMessage
  | BroadcastableMessage
)

export default WebSocketMessage

export function isWebSocketMessage (msg: any): [boolean, string?] {
  if (typeof msg !== 'object') {
    return [false, 'msg is not an object']
  }

  if (typeof msg.type === 'undefined') {
    return [false, 'msg.type is not present']
  }
  if (!(msg.type in WebSocketMessageType)) {
    return [false, 'invalid msg.type']
  }

  const message = msg as WebSocketMessage

  switch (message.type) {
    case WebSocketMessageType.CONNECT_REQUEST: {
      if (typeof message.token !== 'string') {
        return [false, 'msg.token is not a string']
      }
      if (message.token.length !== 32) {
        return [false, 'invalid msg.token']
      }
      break
    }
    default:
      // wildcard on client
  }

  return [true]
}
