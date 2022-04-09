import ChatItem from '../../common/types/ChatItem'
import PublicChat from '../../common/types/PublicChat'
import ViewedMessage from '../../common/types/ViewedMessage'

export type ChatState = ChatItem & {
  fetched: boolean
  info: PublicChat | null
  messages: ViewedMessage[] | null
}

export default interface ChatsState {
  fetched: boolean

  connected: boolean

  chatList: ChatState[]
}

export const defaultChatsState: ChatsState = {
  fetched: false,
  connected: false,
  chatList: []
}
