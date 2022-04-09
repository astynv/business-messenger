import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import InputBox from './InputBox'
import EmojiPicker from './EmojiPicker'
import SendButton from './SendButton'
import { sendMessage } from '../../store/chats/actionCreators'
import NewMessage from '../../common/types/NewMessage'

const OuterContainer = styled.div`
  padding: 30px;
  padding-top: 0;
  background-color: white;
`

const InnerContainer = styled.div`
  border-top: 1px solid #d9d9d9;
  padding-top: 0.75em;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const mapDispatchToProps = {
  sendMessage
}

interface MessageInputContainerProps {
  chatId: string
  sendMessage?: (newMessage: NewMessage) => Promise<any>
}

const MessageInputContainer: React.FC<MessageInputContainerProps> = ({
  chatId,
  sendMessage
}) => {
  const [message, setMessage] = React.useState<string>('')

  const typeEmoji = (emoji: string): void => setMessage(message + emoji)

  // sendMessage
  const handleSend = async (): Promise<void> => {
    if (message === '') {
      return
    }

    if (sendMessage === undefined) {
      return
    }

    setMessage('')

    await sendMessage({
      chatId,
      text: message
      // todo attachments
    })
  }

  return (
    <OuterContainer>
      <InnerContainer>
        <InputBox
          value={message}
          onChange={setMessage}
          onEnterPress={handleSend}
        />
        <EmojiPicker onPicked={typeEmoji} />
        <SendButton
          onClick={handleSend}
        />
      </InnerContainer>
    </OuterContainer>
  )
}

export default connect(null, mapDispatchToProps)(MessageInputContainer)
