import ApiError, { isApiError } from '../common/types/ApiError'

import PublicUser from '../common/types/PublicUser'

import Login from '../common/types/Login'
import NewUser from '../common/types/NewUser'
import NewTodo from '../common/types/NewTodo'
import NewChat from '../common/types/NewChat'
import PublicChat from '../common/types/PublicChat'
import ChatItem from '../common/types/ChatItem'
import ViewedMessage from '../common/types/ViewedMessage'
import NewMessage from '../common/types/NewMessage'
import PublicTodo from '../common/types/PublicTodo'
import TodoCompletionChange from '../common/types/TodoCompletionChange'

type Endpoint = (
  'user' |
  'auth' |
  'findUsers' |
  'chat' |
  'chats' |
  'message' |
  'messages' |
  'readMessage' |
  'todo' |
  'todoChangeCompletion'
)

type ApiResponse = (
  PublicUser |
  PublicUser[] |
  PublicChat |
  ChatItem[] |
  ViewedMessage |
  ViewedMessage[] |
  PublicTodo
)

type ApiRequest = (
  null |
  Login |
  NewUser |
  NewTodo |
  NewChat |
  NewMessage |
  NewTodo |
  TodoCompletionChange
)

const apiUrl = '/api/'

async function api<T extends ApiResponse> (endpoint: Endpoint, params?: Record<string, string>, body?: ApiRequest): Promise<[T | null, Error | null]> {
  const queryString = (
    typeof params !== 'object' ||
    Object.keys(params).length < 1
  ) ? '' : '?' + Object.keys(params).map(
      key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    ).join('&')

  const url = apiUrl + endpoint + queryString

  const requestInit: RequestInit = {}

  if (body !== undefined) {
    requestInit.method = 'POST'
    requestInit.headers = {
      ...(requestInit.headers ?? {}),
      'Content-Type': 'application/json'
    }
    requestInit.body = JSON.stringify(body ?? {})
  }

  const response = await fetch(
    url,
    requestInit
  )

  if (!response.ok) {
    try {
      const data = await response.json()

      if (!isApiError(data)) {
        throw new Error('response is not an api error')
      }

      const { message } = data as ApiError

      return [
        null,
        new Error(`${response.status}: ${message}`)
      ]
    } catch (e) {
      return [
        null,
        new Error(`can't parse error: ${(e as Error).message}`)
      ]
    }
  }

  if (response.status === 204) { // no content
    return [
      null,
      null
    ]
  }

  return [
    await response.json() as T,
    null
  ]
}

export async function userApi (): Promise<[PublicUser | null, Error | null]> {
  const [user, error] = await api<PublicUser>('user')

  if (user !== null) {
    user.lastSeen = new Date(user.lastSeen)
  }

  return [user, error]
}

export async function loginApi (login: Login): Promise<[PublicUser | null, Error | null]> {
  const [user, error] = await api<PublicUser>('auth', {}, login)

  if (user !== null) {
    user.lastSeen = new Date(user.lastSeen)
  }

  return [user, error]
}

export async function signUpApi (newUser: NewUser): Promise<[PublicUser | null, Error | null]> {
  const [user, error] = await api<PublicUser>('user', {}, newUser)

  if (user !== null) {
    user.lastSeen = new Date(user.lastSeen)
  }

  return [user, error]
}

export async function findUsersApi (query: string): Promise<[PublicUser[] | null, Error | null]> {
  const [users, error] = await api<PublicUser[]>('findUsers', { q: query })

  users?.forEach(
    user => { user.lastSeen = new Date(user.lastSeen) }
  )

  return [users, error]
}

export async function getChatsApi (): Promise<[ChatItem[] | null, Error | null]> {
  const [chats, error] = await api<ChatItem[]>('chats')

  chats?.forEach(
    chat => { chat.lastMessage.date = new Date(chat.lastMessage.date) }
  )

  return [chats, error]
}

export async function createChatApi (newChat: NewChat): Promise<[PublicChat | null, Error | null]> {
  const [chat, error] = await api<PublicChat>('chat', {}, newChat)

  return [chat, error]
}

export async function getChatApi (chatId: string): Promise<[PublicChat | null, Error | null]> {
  const [chat, error] = await api<PublicChat>('chat', { id: chatId })

  return [chat, error]
}

export async function getMessagesApi (chatId: string, page: number = 0): Promise<[ViewedMessage[] | null, Error | null]> {
  const [messages, error] = await api<ViewedMessage[]>('messages', { chatId, page: page.toString() })

  messages?.forEach(
    message => { message.date = new Date(message.date) }
  )

  return [messages, error]
}

export async function sendMessageApi (newMessage: NewMessage): Promise<[ViewedMessage | null, Error | null]> {
  const [message, error] = await api<ViewedMessage>('message', {}, newMessage)

  if (message !== null) {
    message.date = new Date(message.date)
  }

  return [message, error]
}

export async function readMessageApi (messageId: string): Promise<Error | null> {
  const [,error] = await api<ViewedMessage>('readMessage', { id: messageId }, null)

  return error
}

export async function createTodoApi (newTodo: NewTodo): Promise<[PublicTodo | null, Error | null]> {
  const [todo, error] = await api<PublicTodo>('todo', {}, newTodo)

  return [todo, error]
}

export async function changeTodoCompletionApi (change: TodoCompletionChange): Promise<[PublicTodo | null, Error | null]> {
  const [todo, error] = await api<PublicTodo>('todoChangeCompletion', {}, change)

  return [todo, error]
}
