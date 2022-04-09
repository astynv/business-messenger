import objectIdRe from '../utils/objectIdRe'

export default interface NewMessage {
  chatId: string
  text?: string
  attachmentsIds?: string[]
}

export function isNewMessage (message: any): [boolean, string?] {
  if (typeof message !== 'object') {
    return [false, 'message is not an object']
  }

  if (typeof message.chatId !== 'string') {
    return [false, 'message.chatId is not a string']
  }
  if (!objectIdRe.test(message.chatId)) {
    return [false, 'message.chatId is not a valid chat id']
  }

  if (typeof message.text !== 'undefined') {
    if (typeof message.text !== 'string') {
      return [false, 'message.text is not a string']
    }
  }

  if (typeof message.attachmentsIds !== 'undefined') {
    if (!(message.attachmentsIds instanceof Array)) {
      return [false, 'message.attachmentsIds is not an array']
    }
    if ((message.attachmentsIds as any[]).some(
      id => typeof id !== 'string' || !objectIdRe.test(id)
    )) {
      return [false, 'message.attachmentsIds contains invalid ids']
    }
  } else {
    if (
      typeof message.text === 'undefined' ||
      message.text === ''
    ) {
      return [false, 'can\'t send neither text nor attachments']
    }
  }

  return [true]
}
