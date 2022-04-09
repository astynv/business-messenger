import React, { useState } from 'react'
import { ModalComponentProps } from 'react-hooks-async-modal'
import styled from 'styled-components'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import ModalWrapper from './ModalWrapper'
import {
  ModalContainer,
  Header
} from './shared'

export interface NewTodo {
  title: string
  description?: string
}

const NewTodoModal: React.FC<ModalComponentProps<NewTodo>> = ({
  onResolve,
  onReject
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value)
  }
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setDescription(e.target.value)
  }

  const handleCreate = () => {
    if (title === '') {
      return
    }

    if (description !== '') {
      onResolve({ title, description })
    } else {
      onResolve({ title })
    }
  }

  return (
    <ModalWrapper
      onOutsideClick={onReject}
    >
      <ModalContainer>
        <Header onClose={onReject}>Create new task</Header>

        <TextField
          label='Title'
          type='text'
          placeholder='Make cool thing'
          variant='outlined'
          margin='normal'
          fullWidth
          value={title}
          onChange={handleTitleChange}
          autoFocus
        />

        <TextField
          label='Description'
          type='text'
          variant='outlined'
          margin='normal'
          fullWidth
          value={description}
          onChange={handleDescriptionChange}
        />

        <NewTodoModalUI>
          <Button
            variant='text'
            color='secondary'
            size='large'
            onClick={onReject}
          >
            Cancel
          </Button>

          <NewTodoModalUISpacer />

          <Button
            variant='outlined'
            color='primary'
            size='large'
            onClick={handleCreate}
          >
            Create
          </Button>
        </NewTodoModalUI>
      </ModalContainer>
    </ModalWrapper>
  )
}

const NewTodoModalUI = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
`

const NewTodoModalUISpacer = styled.div`
  width: 15px;
`

export default NewTodoModal
