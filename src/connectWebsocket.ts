import ActionTypes from './store/ActionTypes'
import ChatsAction, {
  EditTodoAction,
  NewChatAction,
  NewMessageAction,
  NewTodoAction,
  ReadMessageAction
} from './store/chats/ChatsActions'

import WebSocketMessage, {
  ConnectMessage,
  WebSocketMessageType
} from './common/types/WebSocketMessage'

export default async function connectWebsocket (dispatch: (action: ChatsAction) => any): Promise<void> {
  const protocol = window.location.protocol === 'https:'
    ? 'wss:'
    : 'ws:'

  const ws = new WebSocket(`${protocol}//${window.location.host}/api`)

  await new Promise(resolve => { ws.onopen = resolve })

  const token = getCookie('token')

  if (token === null) {
    throw new Error('token cookie not found')
  }

  const message: ConnectMessage = {
    type: WebSocketMessageType.CONNECT_REQUEST,
    token
  }
  ws.send(JSON.stringify(message))

  const messages = toWSMessages(ws)

  for await (const message of messages) {
    switch (message.type) {
      case WebSocketMessageType.CONNECTION_CONFIRMED: {
        console.log('Connected to WS')
        break
      }
      case WebSocketMessageType.CONNECTION_REJECTED: {
        const { reason } = message
        console.log('Connection to WS failed: ' + reason)
        break
      }
      case WebSocketMessageType.NEW_MESSAGE: {
        const { chatId, message: newMessage } = message

        const action: NewMessageAction = {
          type: ActionTypes.NEW_MESSAGE,
          chatId,
          my: false,
          message: {
            ...newMessage,
            date: new Date(newMessage.date)
          }
        }
        dispatch(action)

        break
      }
      case WebSocketMessageType.READ_MESSAGE: {
        const { chatId, messageId, emitentId } = message

        const action: ReadMessageAction = {
          type: ActionTypes.READ_MESSAGE,
          readerId: emitentId,
          chatId,
          messageId
        }
        dispatch(action)

        break
      }
      case WebSocketMessageType.NEW_CHAT: {
        const { chat } = message

        const action: NewChatAction = {
          type: ActionTypes.NEW_CHAT,
          my: false,
          chat: {
            ...chat,
            lastMessage: {
              ...chat.lastMessage,
              date: new Date(chat.lastMessage.date)
            }
          }
        }
        dispatch(action)

        break
      }
      case WebSocketMessageType.NEW_TODO: {
        const action: NewTodoAction = {
          type: ActionTypes.NEW_TODO,
          chatId: message.chatId,
          todo: message.todo
        }
        dispatch(action)

        break
      }
      case WebSocketMessageType.TODO_COMPLETION_CHANGE: {
        const action: EditTodoAction = {
          type: ActionTypes.EDIT_TODO,
          chatId: message.chatId,
          todo: message.todo
        }
        dispatch(action)

        break
      }
    }
  }
}

async function * toWSMessages (ws: WebSocket): AsyncGenerator<WebSocketMessage> {
  while (true) {
    const message = await new Promise<string | null>(resolve => {
      ws.onmessage = e => resolve(e.data)
      ws.onclose = () => resolve(null)
    })

    if (message === null) {
      return
    }

    yield JSON.parse(message) as WebSocketMessage
  }
}

function getCookie (name: string): string | null {
  const matches = document.cookie.match(new RegExp(
    '(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'
  ))
  return matches !== null ? decodeURIComponent(matches[1]) : null
}
