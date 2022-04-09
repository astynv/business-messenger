import { Action } from 'redux'

import ChatItem from '../../common/types/ChatItem'
import PublicChat from '../../common/types/PublicChat'
import PublicTodo from '../../common/types/PublicTodo'
import ViewedMessage from '../../common/types/ViewedMessage'
import ActionTypes from '../ActionTypes'

export interface HydrateChatsAction extends Action<ActionTypes> {
  type: ActionTypes.HYDRATE_CHATS
  chats: ChatItem[]
}

export interface FetchChatAction extends Action<ActionTypes> {
  type: ActionTypes.FETCH_CHAT
  chatId: string
  info: PublicChat
  messages: ViewedMessage[]
}

export interface LoadMessagesAction extends Action<ActionTypes> {
  type: ActionTypes.LOAD_MESSAGES
  chatId: string
  messages: ViewedMessage[]
}

export interface NewMessageAction extends Action<ActionTypes> {
  type: ActionTypes.NEW_MESSAGE
  my: boolean
  chatId: string
  message: ViewedMessage
}

export interface ReadMessageAction extends Action<ActionTypes> {
  type: ActionTypes.READ_MESSAGE
  readerId: string
  chatId: string
  messageId: string
}

export interface NewChatAction extends Action<ActionTypes> {
  type: ActionTypes.NEW_CHAT
  my: boolean
  chat: ChatItem
}

export interface NewTodoAction extends Action<ActionTypes> {
  type: ActionTypes.NEW_TODO
  chatId: string
  todo: PublicTodo
}

export interface EditTodoAction extends Action<ActionTypes> {
  type: ActionTypes.EDIT_TODO
  chatId: string
  todo: PublicTodo
}

type ChatsAction = (
  HydrateChatsAction |
  FetchChatAction |
  LoadMessagesAction |
  NewMessageAction |
  ReadMessageAction |
  NewChatAction |
  NewTodoAction |
  EditTodoAction
)

export default ChatsAction
