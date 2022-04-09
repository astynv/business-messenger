export default interface NewTodo {
  chatId: string
  title: string
  description?: string
  assignedId?: string
}

export function isNewTodo (newTodo: any): [boolean, string?] {
  return [true]
}
