import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import DialogHeader from './DialogHeader'
import DialogPlaceholder from './DialogPlaceholder'
import MessageInputContainer from './MessageInputContainer'
import DialogBody from './DialogBody'

import RootState from '../../store/RootState'
import ChatsState from '../../store/chats/ChatsState'
import {
  fetchChat,
  readMessage
} from '../../store/chats/actionCreators'

import AuthState from '../../store/auth/AuthState'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 0 10px rgb(0 0 0 / 12%);
  border-radius: 5px;
  overflow: hidden;
  background: white;
`

const mapStateToProps = (state: RootState): any => {
  return {
    chatsState: state.chats,
    user: state.auth
  }
}

const mapDispatchToProps = {
  fetchChat,
  readMessage
}

interface DialogContainerProps {
  className?: string

  chatsState?: ChatsState
  user?: AuthState

  fetchChat?: typeof fetchChat
  readMessage?: (chatId: string, messageId: string) => Promise<void>
}

const DialogContainer: React.FC<DialogContainerProps> = ({
  className,

  chatsState,
  user,

  fetchChat,
  readMessage
}) => {
  const params: Record<string, string> = useParams()

  const chat = chatsState?.chatList.find(chat => chat.id === params.chatId)

  useEffect(() => {
    if (chat === undefined) {
      return
    }

    if (!chat.fetched) {
      fetchChat?.(chat.id)
    }
  }, [chat, fetchChat])

  if (chatsState === undefined || user === undefined) {
    return <></>
  }

  if (
    params.chatId === undefined ||
    chat === undefined
  ) {
    return (
      <Container className={className}>
        <DialogPlaceholder />
      </Container>
    )
  }

  return (
    <Container className={className}>
      <DialogHeader
        chat={chat}
      />

      {chat.fetched && (
        <DialogBody
          chat={chat}
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          messages={chat.messages!}
          user={user}
          onRead={(messageId: string) => readMessage?.(chat.id, messageId)}
        />)}
      <MessageInputContainer
        chatId={chat.id}
      />
    </Container>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogContainer)
