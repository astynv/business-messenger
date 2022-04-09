import React, { useRef, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { ModalComponentProps, proxyModal } from 'react-hooks-async-modal'

import List from '@material-ui/core/List'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import UserListItem from '../components/chat-list/UserListItem'
import scrollbarStyle from '../components/scrollbarStyle'
import ModalWrapper from './ModalWrapper'

import PublicUser from '../common/types/PublicUser'
import { createChatApi, findUsersApi } from '../utils/api'
import { createdChat } from '../store/chats/actionCreators'
import RootState from '../store/RootState'
import AuthState from '../store/auth/AuthState'
import NewChat from '../common/types/NewChat'

const mapStateToProps = (state: RootState): any => {
  return {
    auth: state.auth
  }
}

const mapDispatchToProps = {
  createdChat
}

export interface NewChatModalProps {
  auth?: AuthState

  createdChat?: typeof createdChat
}

const NewChatModal: React.FC<NewChatModalProps & ModalComponentProps<void>> = ({
  auth,
  createdChat,

  onResolve
}) => {
  const history = useHistory()

  const [chatTitle, setChatTitle] = useState('')
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setChatTitle(e.target.value)
  }

  const searchInput = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const handleQueryChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    setSearchQuery(e.target.value)

    if (e.target.value === '') {
      return
    }

    const [users] = await findUsersApi(e.target.value)

    if (users !== null) {
      setFound(users)
    }
  }

  const [added, setAdded] = useState<PublicUser[]>(
    auth === undefined ? [] : [{
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      id: auth.id!,
      username: auth.username!,
      firstName: auth.firstName!,

      lastName: auth.lastName!,
      lastSeen: auth.lastSeen!
      /* eslint-enable @typescript-eslint/no-non-null-assertion */
    }]
  )
  const [found, setFound] = useState<PublicUser[]>([])

  const addUser = (id: string): void => {
    const index = found.findIndex(user => user.id === id)

    setAdded([
      ...added,
      found[index]
    ])
    setFound([
      ...found.slice(0, index),
      ...found.slice(index + 1)
    ])

    searchInput.current?.focus()
  }

  const removeUser = (id: string): void => {
    const index = added.findIndex(user => user.id === id)

    setFound([
      added[index],
      ...found
    ])
    setAdded([
      ...added.slice(0, index),
      ...added.slice(index + 1)
    ])
  }

  const handleCreate = async (): Promise<void> => {
    const newChat: NewChat = {
      direct: false,
      memberIds: added.map(user => user.id),
      title: chatTitle.length > 1 ? chatTitle : undefined
    }

    const [chat, error] = await createChatApi(newChat)

    if (chat !== null) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      createdChat!(chat)
      history.push(`/chat/${chat.id}`)
      onResolve()
    } else {
      alert(error?.message)
    }
  }

  return (
    <ModalWrapper
      onOutsideClick={onResolve}
    >
      <ChatFormContainer>
        <CreateChatHeader>Create new chat</CreateChatHeader>

        <TextField
          label='Chat title'
          type='text'
          variant='filled'
          fullWidth
          autoFocus
          value={chatTitle}
          onChange={handleTitleChange}
        />

        <TextField
          label='Search users'
          type='search'
          variant='outlined'
          fullWidth
          margin='normal'
          value={searchQuery}
          onChange={handleQueryChange}
          inputRef={searchInput}
        />

        <CreateChatUsersList>
          {added.length > 0 && (
            <List dense>
              {added.map(
                (user, i) => (
                  <UserListItem
                    key={user.id}
                    onToggle={i !== 0 ? removeUser : undefined}
                    selected
                    {...user}
                  />
                )
              )}
            </List>
          )}
          <List dense>
            {found
              .filter(
                foundUser => added.find(
                  addedUser => foundUser.id === addedUser.id
                ) === undefined
              )
              .map(
                user => (
                  <UserListItem
                    key={user.id}
                    onToggle={addUser}
                    {...user}
                  />
                )
              )}
          </List>
        </CreateChatUsersList>
        <CreateChatUI>
          <Button
            variant='text'
            color='secondary'
            size='large'
            onClick={() => onResolve()}
          >
            Cancel
          </Button>
          <CreateChatUISpacer />
          <Button
            variant='outlined'
            color='primary'
            size='large'
            onClick={handleCreate}
          >
            Create
          </Button>
        </CreateChatUI>
      </ChatFormContainer>
    </ModalWrapper>
  )
}

const ChatFormContainer = styled.div`
  background-color: white;
  box-shadow: 0 0 10px rgb(0 0 0 / 12%);
  border-radius: 5px;
  overflow: hidden;
  width: 650px;
  max-height: calc(100vh - 2*15px - 2*60px);
  padding: 15px;

  display: flex;
  flex-direction: column;
`

const CreateChatHeader = styled.div`
  font-size: 24px;
  text-align: center;
  font-weight: bold;
  font-family: 'Montserrat', sans-serif;
  margin-bottom: 24px;
  margin-top: 10px;
  background: linear-gradient(13deg,#ED7DEB 43%,#7DB3ED 62%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  user-select: none;
`

const CreateChatUsersList = styled.div`
  ${scrollbarStyle}

  overflow-y: scroll;
  margin: 5px 0 15px;
  flex-grow: 1;
`

const CreateChatUI = styled.div`
  display: flex;
  justify-content: flex-end;
`

const CreateChatUISpacer = styled.div`
  width: 15px;
`

export default proxyModal(
  connect(mapStateToProps, mapDispatchToProps)(NewChatModal)
)
