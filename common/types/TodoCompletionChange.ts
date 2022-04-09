export default interface TodoCompletionChange {
  id: string
  chatId: string
  completed: boolean
}

export function isTodoCompletionChange (obj: any): [boolean, string?] {
  // todo validation

  return [true]
}
