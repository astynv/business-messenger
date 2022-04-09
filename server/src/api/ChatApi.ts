import {
  Request,
  Response
} from 'express'
import ChatItem from '../common/types/ChatItem'
import NewChat, { isNewChat } from '../common/types/NewChat'
import NewMessage, { isNewMessage } from '../common/types/NewMessage'
import { Chat, Message } from '../entities'

import GenericApi from './GenericApi'

export default class ChatApi extends GenericApi {
  get = async (req: Request, res: Response): Promise<void> => {
    const ec = this.getEntityControllers()

    if (
      req.query.id === undefined ||
      typeof req.query.id !== 'string' ||
      !/^[0-9a-f]{24}$/.test(req.query.id)
    ) {
      res.status(400)
      res.json({
        message: 'provide valid query param \'id\''
      })
      return
    }

    const user = await GenericApi.getUser(ec, req, res)

    if (user === null) {
      res.status(401)
      res.json({
        message: 'unauthorized'
      })
      return
    }

    const chat = await ec.Chat.getById(req.query.id)

    if (chat === null || !chat.members.contains(user)) {
      res.status(403)
      res.json({
        message: 'you\'re not a member of this chat'
      })
      return
    }

    res.json(chat.toPublic())
  }

  sendMessage = async (req: Request, res: Response): Promise<void> => {
    const ec = this.getEntityControllers()

    const sender = await GenericApi.getUser(ec, req, res)

    if (sender === null) {
      res.status(401)
      res.json({
        message: 'not authorized'
      })
      return
    }

    const { body } = req

    // input validation
    const [valid, reason] = isNewMessage(body)

    if (!valid) {
      res.status(400)
      res.json({
        message: reason
      })
      return
    }
    const newMessage = body as NewMessage

    const chat = await ec.Chat.getById(newMessage.chatId)

    if (chat === null || !chat.members.contains(sender)) {
      res.status(403)
      res.json({
        message: 'you\'re not a member of this chat'
      })
      return
    }

    const message = await ec.Chat.sendMessage(chat, sender, newMessage)

    res.json(
      await message.toViewed(sender)
    )
  }

  readMessage = async (req: Request, res: Response): Promise<void> => {
    const ec = this.getEntityControllers()

    const user = await GenericApi.getUser(ec, req, res)

    if (user === null) {
      res.status(401)
      res.json({
        message: 'not authorized'
      })
      return
    }

    if (
      req.query.id === undefined ||
      typeof req.query.id !== 'string' ||
      !/^[0-9a-f]{24}$/.test(req.query.id)
    ) {
      res.status(400)
      res.json({
        message: 'provide valid query param \'id\''
      })
      return
    }

    const success = await ec.Chat.tryReadMessage(user, req.query.id)

    if (!success) {
      res.status(403)
      res.json({
        message: 'you\'re not a member of this chat'
      })
    } else {
      res.status(204)
      res.end()
    }
  }

  getMessages = async (req: Request, res: Response): Promise<void> => {
    const ec = this.getEntityControllers()

    if (
      req.query.chatId === undefined ||
      typeof req.query.chatId !== 'string' ||
      !/^[0-9a-f]{24}$/.test(req.query.chatId) ||
      req.query.page === undefined ||
      typeof req.query.page !== 'string' ||
      isNaN(parseInt(req.query.page))
    ) {
      res.status(400)
      res.json({
        message: 'provide valid query params \'chatId\' and \'page\''
      })
      return
    }

    const user = await GenericApi.getUser(ec, req, res)

    if (user === null) {
      res.status(401)
      res.json({
        message: 'unauthorized'
      })
      return
    }

    const chat = await ec.Chat.getById(req.query.chatId)

    if (chat === null || !chat.members.contains(user)) {
      res.status(403)
      res.json({
        message: 'you\'re not a member of this chat'
      })
      return
    }

    const messages = await ec.Chat.getMessagesPage(chat, parseInt(req.query.page))

    res.json(await Promise.all(
      messages.map(async message => await message.toViewed(user))
    ))
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    const ec = this.getEntityControllers()

    const user = await GenericApi.getUser(ec, req, res)

    if (user === null) {
      res.status(401)
      res.json({
        message: 'unauthorized'
      })
      return
    }

    const allChats = await user.chats.loadItems()
    const lastMessages = new Map<Chat, Message>()

    for (const chat of allChats) {
      lastMessages.set(chat, await ec.Chat.getLastMessage(chat))
    }

    allChats.sort(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (chatA, chatB) => lastMessages.get(chatB)!.date.valueOf() - lastMessages.get(chatA)!.date.valueOf()
    )

    const items: ChatItem[] = await Promise.all(allChats.map(async chat => ({
      id: chat.id,
      title: chat.title,
      unreadCount: await ec.Chat.getUnreadCount(chat, user),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      lastMessage: await lastMessages.get(chat)!.toViewed(user)
    })))

    res.json(items)
  }

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
    const [valid, reason] = isNewChat(body)

    if (!valid) {
      res.status(400)
      res.json({
        message: reason
      })
      return
    }
    const newChat = body as NewChat

    if (newChat.direct) {
      res.status(501)
      res.json({
        message: 'can\'t create direct chats yet' // todo
      })
      return
    }

    const users = await ec.User.getByIds(newChat.memberIds)

    if (users.find(user => user === creator) === undefined) {
      res.status(400)
      res.json({
        message: 'you can\'t create chats without yourself'
      })
      return
    }

    const chat = await ec.Chat.create(creator, newChat, users)

    res.json(chat.toPublic())
  }
}
