import ChatsAction from './ChatsActions'
import ChatsState, { defaultChatsState } from './ChatsState'
import ActionTypes from '../ActionTypes'

export default function chatsReducer (state: ChatsState = defaultChatsState, action?: ChatsAction): ChatsState {
  if (action === undefined) {
    return state
  }

  switch (action.type) {
    case ActionTypes.HYDRATE_CHATS: {
      const { chats } = action

      return {
        ...state,

        fetched: true,
        chatList: chats.map(chat => ({
          ...chat,

          fetched: false,
          info: null,
          messages: null
        }))
      }
    }
    case ActionTypes.FETCH_CHAT: {
      const { chatId, info, messages } = action

      const chatIndex = state.chatList.findIndex(chat => chat.id === chatId)

      return {
        ...state,

        chatList: [
          ...state.chatList.slice(0, chatIndex),
          {
            ...state.chatList[chatIndex],

            fetched: true,
            info,
            messages: messages.reverse()
          },
          ...state.chatList.slice(chatIndex + 1)
        ]
      }
    }
    case ActionTypes.NEW_MESSAGE: {
      const { message, chatId, my } = action

      const chatIndex = state.chatList.findIndex(chat => chat.id === chatId)

      if (chatIndex === -1) {
        return state
      }

      return {
        ...state,

        chatList: [
          {
            ...state.chatList[chatIndex],

            lastMessage: message,
            unreadCount: my ? 0 : state.chatList[chatIndex].unreadCount + 1,

            messages: [
              ...(state.chatList[chatIndex].messages ?? []),
              message
            ]
          },
          ...state.chatList.slice(0, chatIndex),
          ...state.chatList.slice(chatIndex + 1)
        ]
      }
    }
    case ActionTypes.READ_MESSAGE: {
      const { messageId, chatId, readerId } = action

      const chatIndex = state.chatList.findIndex(chat => chat.id === chatId)
      const chat = state.chatList[chatIndex]
      const messageIndex = chat.messages?.findIndex(
        message => message.id === messageId
      )

      return {
        ...state,

        chatList: [
          ...state.chatList.slice(0, chatIndex),
          {
            /* eslint-disable @typescript-eslint/no-non-null-assertion */
            ...chat,

            lastMessage: chat.lastMessage.id !== messageId
              ? chat.lastMessage
              : {
                ...chat.lastMessage,
                read: true
              },
            unreadCount: chat.fetched
              ? chat.unreadCount - chat.messages!
                .slice(0, messageIndex! + 1)
                .reduce( // count unread -> read
                  (cnt, msg) => cnt + (!msg.read && msg.sender.id !== readerId ? 1 : 0),
                  0
                )
              : chat.unreadCount,

            messages: chat.messages === null
              ? null
              : [
                ...chat.messages
                  .slice(0, messageIndex! + 1)
                  .map(message => ({
                    ...message,
                    read: true
                  })),
                ...chat.messages.slice(messageIndex! + 1)
              ]
            /* eslint-enable @typescript-eslint/no-non-null-assertion */
          },
          ...state.chatList.slice(chatIndex + 1)
        ]
      }
    }
    case ActionTypes.NEW_CHAT: {
      const { chat, my } = action

      return {
        ...state,

        chatList: [
          {
            ...chat,

            unreadCount: my ? 0 : 1,
            fetched: false,
            info: null,
            messages: null
          },
          ...state.chatList
        ]
      }
    }
    case ActionTypes.NEW_TODO: {
      const { chatId, todo } = action

      const chatIndex = state.chatList.findIndex(chat => chat.id === chatId)
      const chat = state.chatList[chatIndex]

      return {
        ...state,

        chatList: [
          ...state.chatList.slice(0, chatIndex),
          {
            ...chat,

            info: chat.fetched ? {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              ...chat.info!,

              todos: [
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                ...chat.info!.todos,
                todo
              ]
            } : null
          },
          ...state.chatList.slice(chatIndex + 1)
        ]
      }
    }
    case ActionTypes.EDIT_TODO: {
      const { chatId, todo } = action

      const chatIndex = state.chatList.findIndex(chat => chat.id === chatId)
      const chat = state.chatList[chatIndex]
      const todoIndex = chat.info?.todos.findIndex(present => present.id === todo.id)

      return {
        ...state,

        chatList: [
          ...state.chatList.slice(0, chatIndex),
          {
            ...chat,

            info: chat.fetched ? {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              ...chat.info!,

              todos: [
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                ...chat.info!.todos.slice(0, todoIndex),
                todo,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                ...chat.info!.todos.slice(todoIndex! + 1)
              ]
            } : null
          },
          ...state.chatList.slice(chatIndex + 1)
        ]
      }
    }
    default: {
      return state
    }
  }
}
