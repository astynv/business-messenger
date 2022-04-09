import MessageType from './MessageType'
import ViewedAttachment from './ViewedAttachment'

export default interface ViewedMessage {
  id: string
  date: Date
  sender: {
    id: string
    name: string
  }
  type: MessageType
  attachments: ViewedAttachment[]
  read: boolean
  text?: string
}
