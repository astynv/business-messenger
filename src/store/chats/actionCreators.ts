import { Action } from 'redux'

import RootState from '../RootState'

import {
  getChatsApi,
  getChatApi,
  getMessagesApi,
  sendMessageApi,
  readMessageApi,
  createTodoApi,
  changeTodoCompletionApi
} from '../../utils/api'

import ThunkAction from '../ThunkAction'
import ActionTypes from '../ActionTypes'
import {
  EditTodoAction,
  FetchChatAction,
  HydrateChatsAction,
  NewChatAction,
  NewMessageAction,
  NewTodoAction,
  ReadMessageAction
} from './ChatsActions'
import NewMessage from '../../common/types/NewMessage'
import PublicChat from '../../common/types/PublicChat'
import MessageType from '../../common/types/MessageType'
import NewTodo from '../../common/types/NewTodo'
import TodoCompletionChange from '../../common/types/TodoCompletionChange'
import imitateMyViewedMessage from '../../utils/imitatePublicMessage'

export const hydrateChats = () => async (dispatch: (action: Action | ThunkAction) => any, getState: () => RootState) => {
  const [chats, error] = await getChatsApi()

  if (chats !== null) {
    const action: HydrateChatsAction = {
      type: ActionTypes.HYDRATE_CHATS,
      chats
    }
    dispatch(action)
  } else {
    alert(error?.message)
  }
}

export const fetchChat = (chatId: string) => async (dispatch: (action: Action | ThunkAction) => any, getState: () => RootState) => {
  const [
    [chat, chatError],
    [messages, messagesError]
  ] = await Promise.all([
    getChatApi(chatId),
    getMessagesApi(chatId)
  ])

  if (chat !== null && messages !== null) {
    const action: FetchChatAction = {
      type: ActionTypes.FETCH_CHAT,
      chatId,
      info: chat,
      messages
    }
    dispatch(action)
  } else {
    alert(
      `${chatError?.message ?? 'no chatError'}\n\n${messagesError?.message ?? 'no messagesError'}`
    )
  }
}

export const sendMessage = (newMessage: NewMessage) => async (dispatch: (action: Action | ThunkAction) => any, getState: () => RootState) => {
  const [message, error] = await sendMessageApi(newMessage)

  if (message === null) {
    alert(error?.message)
    return
  }

  const action: NewMessageAction = {
    type: ActionTypes.NEW_MESSAGE,
    my: true,
    chatId: newMessage.chatId,
    message
  }

  // message
  dispatch(action)
}

export const readMessage = (chatId: string, messageId: string) => async (dispatch: (action: Action | ThunkAction) => any, getState: () => RootState) => {
  const action: ReadMessageAction = {
    type: ActionTypes.READ_MESSAGE,
    // can't be made without auth
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    readerId: getState().auth.id!,
    chatId,
    messageId
  }
  dispatch(action)

  const error = await readMessageApi(messageId)

  if (error !== null) {
    alert(error.message)
  }
}

export const createdChat = (chat: PublicChat): NewChatAction => {
  return {
    type: ActionTypes.NEW_CHAT,
    my: true,
    chat: {
      id: chat.id,
      title: chat.title,
      unreadCount: 0,
      lastMessage: imitateMyViewedMessage(MessageType.CREATED)
    }
  }
}

export const createTodo = (newTodo: NewTodo) => async (dispatch: (action: Action | ThunkAction) => any, getState: () => RootState) => {
  const [todo, error] = await createTodoApi(newTodo)

  if (todo === null) {
    alert(error?.message)
    return
  }

  const action: NewTodoAction = {
    type: ActionTypes.NEW_TODO,
    chatId: newTodo.chatId,
    todo
  }
  dispatch(action)

  const messageAction: NewMessageAction = {
    type: ActionTypes.NEW_MESSAGE,
    chatId: newTodo.chatId,
    my: true,
    message: imitateMyViewedMessage(MessageType.CREATED_TODO)
  }
  dispatch(messageAction)
}

export const changeTodoCompletion = (change: TodoCompletionChange) => async (dispatch: (action: Action | ThunkAction) => any, getState: () => RootState) => {
  const [todo, error] = await changeTodoCompletionApi(change)

  if (todo === null) {
    alert(error?.message)
    return
  }

  const action: EditTodoAction = {
    type: ActionTypes.EDIT_TODO,
    chatId: change.chatId,
    todo
  }
  dispatch(action)

  const messageAction: NewMessageAction = {
    type: ActionTypes.NEW_MESSAGE,
    chatId: change.chatId,
    my: true,
    message: imitateMyViewedMessage(MessageType.CHANGED_TODO_COMPLETION)
  }
  dispatch(messageAction)
}
