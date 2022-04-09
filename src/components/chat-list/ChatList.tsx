import * as React from 'react'
import styled from 'styled-components'

import DialogEntry from './dialog-entry/DialogEntry'
import scrollbarStyle from '../scrollbarStyle'

import ChatItem from '../../common/types/ChatItem'
import AuthState from '../../store/auth/AuthState'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% + 0.2em);

  overflow-y: scroll;

  div:nth-child(n+2) {
    margin-top: 0.5em;
  }

  padding-right: 0.5em;

  ${scrollbarStyle}
`

interface ChatListProps {
  user: AuthState
  dialogs: ChatItem[]
  selectedId?: string

  className?: string
  onSelect: (id: string) => void
}

const ChatList: React.FC<ChatListProps> = ({
  user,
  dialogs,
  selectedId,
  className,
  onSelect
}) => (
  <Container className={className}>
    {
      dialogs.map(
        dialog => (
          <DialogEntry
            key={dialog.id}
            user={user}
            selected={dialog.id === selectedId}
            chat={dialog}
            onSelect={onSelect}
          />
        )
      )
    }
  </Container>
)

export default ChatList
