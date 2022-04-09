import ViewedMessage from './ViewedMessage'

export default interface ChatItem {
  id: string
  title?: string
  unreadCount: number
  lastMessage: ViewedMessage
}
