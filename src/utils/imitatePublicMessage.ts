import MessageType from '../common/types/MessageType'
import ViewedMessage from '../common/types/ViewedMessage'

export default function imitateMyViewedMessage (type: MessageType): ViewedMessage {
  return {
    id: 'unknown-' + Math.round(Math.random() * 10000).toString(),
    read: true,
    attachments: [],
    type: type,
    date: new Date(),
    sender: {
      id: 'doesn\'t matter',
      name: 'You'
    }
  }
}
