import PublicTodo from './PublicTodo'
import PublicUser from './PublicUser'

export default interface PublicChat {
  id: string
  direct: boolean
  members: PublicUser[]
  title?: string
  todos: PublicTodo[]
}
