import React from 'react'
import { connect } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import AuthState from '../../store/auth/AuthState'
import ChatsState from '../../store/chats/ChatsState'
import RootState from '../../store/RootState'

import ChatList from './ChatList'
import SearchBox from './SearchBox'
import TitleAndButton from './TitleAndButton'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledSearchBox = styled(SearchBox)`
  margin-top: 1em;
`

const StyledChatList = styled(ChatList)`
  margin-top: 0.5em;
`

const mapStateToProps = (state: RootState): any => {
  return {
    chatsState: state.chats,
    user: state.auth
  }
}

interface ChatsListContainerProps {
  className?: string
  chatsState?: ChatsState
  user?: AuthState
}

const ChatsListContainer: React.FC<ChatsListContainerProps> = ({
  className,
  chatsState,
  user
}) => {
  const params: Record<string, string> = useParams()
  const history = useHistory()

  if (chatsState === undefined || user === undefined) {
    return <></>
  }

  return (
    <Container className={className}>
      <TitleAndButton />
      <StyledSearchBox />
      <StyledChatList
        user={user}
        selectedId={params.chatId ?? ''}
        dialogs={chatsState.chatList}
        onSelect={id => history.push(`/chat/${id}`)}
      />
    </Container>
  )
}

export default connect(mapStateToProps)(ChatsListContainer)
