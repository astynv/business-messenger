export default interface NewChat {
  direct: boolean
  memberIds: string[]
  title?: string
}

export function isNewChat (chat: any): [boolean, string?] {
  if (typeof chat !== 'object') {
    return [false, 'chat is not an object']
  }

  if (typeof chat.direct !== 'boolean') {
    return [false, 'chat.direct is not a boolean']
  }
  if (
    typeof chat.memberIds !== 'object' ||
    !(chat.memberIds instanceof Array) ||
    (chat.memberIds as any[]).some((id: any) => typeof id !== 'string')
  ) {
    return [false, 'chat.memberIds is not an Array<string>']
  }

  if (chat.direct as boolean) {
    if (typeof chat.title === 'string') {
      return [false, 'you can\'t name direct chats']
    }
  }

  // todo better checks

  return [true]
}
