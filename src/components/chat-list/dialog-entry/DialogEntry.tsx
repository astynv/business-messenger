import * as React from 'react'
import styled, { css } from 'styled-components'
import ChatItem from '../../../common/types/ChatItem'
import MessageType from '../../../common/types/MessageType'
import AuthState from '../../../store/auth/AuthState'
import SpecialMessageMarkup from '../../SpecialMessageMarkup'

import AvatarNameTime from './AvatarNameTime'

interface ContainerProps {
  selected: boolean
}

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${({ selected }) =>
    selected
      ? css`
          background: #4b9ef2;
          box-shadow: none;
      `
      : css`
        background: white;
      `
  }

  box-shadow: 0px 0px 10px 0px #e7e7e7;
  border-radius: 0.25em;
  cursor: pointer;
  transition: background 0.2s linear;
`

const MessageContainer = styled.div<{selected: boolean}>`
  margin-top: 0 !important;
  display: flex;
  flex-direction: row;
  color: ${({ selected }) => selected ? 'white' : 'gray'};
`

const Message = styled.div`
  margin: 0;
  padding: 1em;
  padding-top: 0;
  padding-left: calc(50px + 2.5em);
  font-size: 0.7em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Indicator = styled.div<{ my?: boolean }>`
  flex-shrink: 0;
  margin-top: 0 !important;
  padding: 0.3em 0.5em 0;
  font-size: 0.5em;
  margin-right: 2em;
  margin-left: auto;
  width: fit-content;
  min-width: 0.75em;
  height: 1.5em;
  border-radius: calc((1.5em + 0.3em) / 2);
  background-color: ${({ my = false }) => !my ? '#FD3367' : '#bababa'};
  text-align: center;
  line-height: 1.3em;
  color: white;
  font-weight: bold;
`

interface DialogEntryProps {
  user: AuthState
  chat: ChatItem
  selected: boolean
  onSelect: (id: string) => void
}

const DialogEntry: React.FC<DialogEntryProps> = ({
  user,
  chat,
  selected,
  onSelect
}) => (
  <Container selected={selected} onMouseDown={_ => onSelect(chat.id)}>
    <AvatarNameTime
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-assertion
      name={chat.title!} // todo
      avatar={null}
      date={chat.lastMessage.date}
      selected={selected}
    />
    <MessageContainer selected={selected}>
      <Message>
        {chat.lastMessage.type === MessageType.DEFAULT ? (
          <>
            <strong>
              {chat.lastMessage.sender.name}:&nbsp;
            </strong>
            {chat.lastMessage.text}
          </>
        ) : (
          <SpecialMessageMarkup message={chat.lastMessage} />
        )}

      </Message>
      {
        chat.lastMessage.sender.id !== user.id
          ? (
            chat.unreadCount > 0 && <Indicator>{chat.unreadCount}</Indicator>
          )
          : !chat.lastMessage.read && (
            <Indicator my />
          )
      }

    </MessageContainer>
  </Container>
)

export default DialogEntry
