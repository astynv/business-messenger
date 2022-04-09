import React from 'react'
import MessageType from '../common/types/MessageType'
import ViewedMessage from '../common/types/ViewedMessage'

interface SpecialMessageMarkupProps {
  message: ViewedMessage
}

const SpecialMessageMarkup: React.FC<SpecialMessageMarkupProps> = ({
  message
}) => message.type === MessageType.CREATED ? (
  <><strong>{message.sender.name}</strong> created the chat</>
) : message.type === MessageType.JOINED ? (
  <><strong>{message.sender.name}</strong> joined the chat</>
) : message.type === MessageType.LEFT ? (
  <><strong>{message.sender.name}</strong> left the chat</>
) : message.type === MessageType.CREATED_TODO ? (
  <><strong>{message.sender.name}</strong> created new task</>
) : message.type === MessageType.CHANGED_TODO_COMPLETION ? (
  <><strong>{message.sender.name}</strong> changed task status</>
) : (
  <><strong>{message.sender.name}:</strong> Attachments</>
)

export default SpecialMessageMarkup
