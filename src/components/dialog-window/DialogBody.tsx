import React, {
  Ref,
  forwardRef,
  useEffect,
  useRef
} from 'react'
import styled from 'styled-components'
import MessageType from '../../common/types/MessageType'

import ViewedMessage from '../../common/types/ViewedMessage'
import AuthState from '../../store/auth/AuthState'
import { ChatState } from '../../store/chats/ChatsState'
import Avatar from '../Avatar'
import scrollbarStyle from '../scrollbarStyle'
import SpecialMessageMarkup from '../SpecialMessageMarkup'

function formatTime (dt: Date): string {
  return `${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}`
}

interface TextBodyProps {
  my: boolean
  name: string
  time: string
  text: string
}

const TextBody: React.FC<TextBodyProps> = ({ my, name, time, text }) => (
  <TextBodyContainer
    my={my}
  >
    <TextBodyHeader
      my={my}
    >
      {name}, {time}
    </TextBodyHeader>
    <TextBodyText>
      {text}
    </TextBodyText>
  </TextBodyContainer>
)

interface MessageProps {
  message: ViewedMessage
  user: AuthState
  repeats: boolean

  onHover: (message: ViewedMessage) => any
}

interface RefProps {
  ref: Ref<HTMLDivElement>
}

const Message: React.ForwardRefExoticComponent<MessageProps & RefProps> = forwardRef(
  ({ message, user, repeats, onHover }: MessageProps, ref: Ref<HTMLDivElement>) =>
    message.type === MessageType.DEFAULT ? (
      <MessageContainer
        my={message.sender.id === user.id}
        repeats={repeats}
        ref={ref}
        onMouseOver={() => onHover(message)}
      >
        <UnreadContainer>
          {!message.read && <UnreadMark my={message.sender.id === user.id} />}
        </UnreadContainer>
        {message.text !== undefined && (
          <TextBody
            my={message.sender.id === user.id}
            name={message.sender.name}
            time={formatTime(message.date)}
            text={message.text}
          />
        )}
        {message.sender.id !== user.id && (
          <AvatarContainer>
            <Avatar
              avatar={null}
              title={message.sender.name}
            />
          </AvatarContainer>
        )}

      </MessageContainer>
    ) : (
      <ServiceMessageContainer
        ref={ref}
        onMouseOver={() => onHover(message)}
      >
        <SpecialMessageMarkup message={message} />
      </ServiceMessageContainer>
    )
)

interface DialogBodyProps {
  chat: ChatState
  messages: ViewedMessage[]
  user: AuthState

  onRead: (messageId: string) => any
}

const DialogBody: React.FC<DialogBodyProps> = ({ chat, messages, user, onRead }) => {
  const messagesContainer = useRef<HTMLDivElement>(null)
  const messageRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    let scrolled = false

    for (let i = 0; i < messages.length; i += 1) {
      if (messages[i].sender.id !== user.id && !messages[i].read) {
        messageRefs.current[i]?.scrollIntoView()
        messagesContainer.current?.scrollBy(0, -150)
        scrolled = true
        break
      }
    }

    if (!scrolled) {
      messagesContainer.current?.scrollTo(0, messagesContainer.current.scrollHeight)
    }
  // eslint-disable-next-line
  }, [chat.id])

  const lastMesssageId = messages[messages.length - 1].id
  const prevLastMessageId = useRef<string>('')
  useEffect(() => {
    if (prevLastMessageId.current === '') {
      prevLastMessageId.current = lastMesssageId
      return
    }

    messagesContainer.current?.scrollTo(0, messagesContainer.current.scrollHeight)
  }, [lastMesssageId])

  const handleHover = (message: ViewedMessage): void => {
    if (!message.read && message.sender.id !== user.id) {
      onRead(message.id)
    }
  }

  return (
    <MessagesContainer
      ref={messagesContainer}
    >
      {messages.map((message, i) => (
        <Message
          key={message.id}
          ref={(el: HTMLDivElement) => (messageRefs.current[i] = el)}
          user={user}
          message={message}
          repeats={message.sender.id === messages[i - 1]?.sender.id}
          onHover={handleHover}
        />
      ))}
    </MessagesContainer>
  )
}
export default DialogBody

const MessagesContainer = styled.div`
  ${scrollbarStyle}

  padding: 90px 30px 45px;
  overflow-y: scroll;
  flex-grow: 1;
`

const ServiceMessageContainer = styled.div`
  color: #202020;
  font-size: 18px;
  text-align: center;
  margin: 18px 0;
`

const MessageContainer = styled.div<{ my: boolean, repeats: boolean }>`
  font-size: 18px;
  margin-top: ${({ repeats }) => repeats ? '7px' : '14px'};

  display: flex;
  justify-content: flex-end;// ${({ my }) => my ? 'flex-end' : 'flex-start'};
  flex-direction: ${({ my }) => my ? 'row' : 'row-reverse'};
`

const TextBodyContainer = styled.div<{ my: boolean }>`
  max-width: 75%;
  padding: 20px 20px;
  border-radius: 20px;
  background: ${({ my }) => my
    ? '#4b9ef2'
    : '#eaeaea'
  };
  color: ${({ my }) => my
    ? 'white'
    : 'black'
  };
`

const TextBodyHeader = styled.div<{ my: boolean }>`
  color: ${({ my }) => my
    ? 'white'
    : '#3291f1'
  };
  font-size: 14px;
`

const TextBodyText = styled.div`
  margin: 5px 0 0;
`

const UnreadMark = styled.div<{ my: boolean }>`
  height: 10px;
  width: 10px;
  border-radius: 5px;
  background-color: ${({ my }) => my
    ? '#3291f1'
    : '#ea3267'
  };
`

const UnreadContainer = styled.div`
  padding: 15px 10px;
  display: flex;
  align-items: flex-end;
`

const AvatarContainer = styled.div`
  margin: 10px;
  margin-left: 0;
  display: flex;
  align-items: flex-start;
`
