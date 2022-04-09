import React from 'react'
import { ModalComponentProps } from 'react-hooks-async-modal'
import styled from 'styled-components'

import List from '@material-ui/core/List'

import PublicChat from '../common/types/PublicChat'
import Avatar from '../components/Avatar'
import ModalWrapper from './ModalWrapper'
import {
  DialogInfo,
  DialogTitle,
  DialogSub
} from '../components/dialog-window/DialogHeader'
import UserListItem from '../components/chat-list/UserListItem'
import {
  ModalContainer,
  Header,
  Label,
  Section
} from './shared'

export interface ChatInfoModalProps {
  chatInfo: PublicChat
}

const ChatInfoModal: React.FC<ChatInfoModalProps & ModalComponentProps<void>> = ({
  chatInfo,
  onResolve
}) => (
  <ModalWrapper
    onOutsideClick={onResolve}
  >
    <ModalContainer>
      <Header
        onClose={onResolve}
      >
        This chat
      </Header>
      <ChatTitle>
        <Avatar
          avatar={null}
          title={chatInfo.title ?? ''}
        />
        <DialogInfo>
          <DialogTitle>{chatInfo.title}</DialogTitle>
          {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
          <DialogSub>{chatInfo.members.length} members</DialogSub>
        </DialogInfo>
      </ChatTitle>
      <Label>Members</Label>
      <Section>
        <List dense>
          {chatInfo.members.map(
            (user, i) => (
              <UserListItem
                key={user.id}
                onToggle={(id) => console.log(id)}
                selected
                {...user}
              />
            )
          )}
        </List>
      </Section>
    </ModalContainer>
  </ModalWrapper>
)

const ChatTitle = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0;
`

export default ChatInfoModal
