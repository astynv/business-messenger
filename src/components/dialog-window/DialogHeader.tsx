import React from 'react'
import styled from 'styled-components'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck'
import MoreVertIcon from '@material-ui/icons/MoreVert'

import { ChatState } from '../../store/chats/ChatsState'
import Avatar from '../Avatar'
import { useModal } from 'react-hooks-async-modal'
import ChatInfoModal, { ChatInfoModalProps } from '../../modals/ChatInfoModal'
import TodosModal, { TodosModalProps } from '../../modals/TodosModal'

const Container = styled.div`
  padding: 20px;
  font-size: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #FAFBFF;
  border-bottom: 1px solid #d9d9d9;
`

export const DialogInfo = styled.div`
  overflow: hidden;
  margin-left: 12px;
`

export const DialogTitle = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

export const DialogSub = styled.div`
  margin-top: 2px;
  font-size: 16px;
  color: #727272;
`

const DialogUI = styled.div`
  margin-left: auto;
`

interface DialogHeaderProps {
  chat: ChatState
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ chat }) => {
  const callChatInfoModal = useModal<ChatInfoModalProps>(ChatInfoModal)
  const callTodosModal = useModal<TodosModalProps>(TodosModal)

  return (
    <Container>
      <Avatar
        avatar={null}
        title={chat.title ?? ''}
      />
      <DialogInfo>
        <DialogTitle>{chat.title}</DialogTitle>
        {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
        <DialogSub>{chat.fetched ? `${chat.info!.members.length} members` : 'Loading...'}</DialogSub>
      </DialogInfo>

      <DialogUI>
        <Tooltip title='Tasks'>
          <IconButton
            onClick={
              async () => chat.info !== null && await callTodosModal({ chatInfo: chat.info })
            }
          >
            <PlaylistAddCheckIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title='Info'>
          <IconButton
            onClick={
              async () => chat.info !== null && await callChatInfoModal({ chatInfo: chat.info })
            }
          >
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
      </DialogUI>
    </Container>
  )
}

export default DialogHeader
