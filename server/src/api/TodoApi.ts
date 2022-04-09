import {
  Request,
  Response
} from 'express'

import NewTodo, { isNewTodo } from '../common/types/NewTodo'
import TodoCompletionChange, { isTodoCompletionChange } from '../common/types/TodoCompletionChange'

import GenericApi from './GenericApi'

export default class TodoApi extends GenericApi {
  create = async (req: Request, res: Response): Promise<void> => {
    const ec = this.getEntityControllers()

    const creator = await GenericApi.getUser(ec, req, res)

    if (creator === null) {
      res.status(401)
      res.json({
        message: 'not authorized'
      })
      return
    }

    const { body } = req

    // input validation
    const [valid, reason] = isNewTodo(body)

    if (!valid) {
      res.status(400)
      res.json({
        message: reason
      })
      return
    }
    const newTodo = body as NewTodo

    const chat = await ec.Chat.getById(newTodo.chatId)

    if (chat === null) {
      res.status(403)
      res.json({
        message: 'you\'re not a member of this chat'
      })
      return
    }

    const todo = await ec.Chat.createTodo(creator, chat, newTodo)

    res.json(todo.toPublic())
  }

  changeCompletion = async (req: Request, res: Response): Promise<void> => {
    const ec = this.getEntityControllers()

    const user = await GenericApi.getUser(ec, req, res)

    if (user === null) {
      res.status(401)
      res.json({
        message: 'not authorized'
      })
      return
    }

    const { body } = req

    // input validation
    const [valid, reason] = isTodoCompletionChange(body)

    if (!valid) {
      res.status(400)
      res.json({
        message: reason
      })
      return
    }
    const completionChange = body as TodoCompletionChange

    const todo = await ec.Chat.getTodoById(completionChange.id)

    const chat = todo?.chat ?? null

    if (todo === null || chat === null || !chat.members.contains(user)) {
      res.status(403)
      res.json({
        message: 'you\'re not a member of this chat'
      })
      return
    }

    await ec.Chat.setTodoCompletion(user, todo, completionChange.completed)

    res.json(todo.toPublic())
  }
}
