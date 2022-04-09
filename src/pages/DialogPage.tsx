import React from 'react'
import styled from 'styled-components'

import ChatsListContainer from '../components/chat-list/ChatsListContainer'
import DialogContainer from '../components/dialog-window/DialogContainer'

const StyledChatsListContainer = styled(ChatsListContainer)`
  flex-shrink: 2;
  width: 20em;
  font-size: 0.75em;
`

const StyledDialogContainer = styled(DialogContainer)`
  width: 30em;
  margin-left: 1em;
`

const DialogPage: React.FC = () => (
  <>
    <StyledChatsListContainer />
    <StyledDialogContainer />
  </>
)

export default DialogPage
