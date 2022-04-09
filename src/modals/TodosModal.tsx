import React from 'react'
import { connect } from 'react-redux'
import { ModalComponentProps, useModal } from 'react-hooks-async-modal'
import styled from 'styled-components'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Checkbox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'

import ModalWrapper from './ModalWrapper'
import {
  ModalContainer,
  Header,
  Section
} from './shared'

import PublicTodo from '../common/types/PublicTodo'
import NewTodoModal, { NewTodo } from './NewTodoModal'
import PublicChat from '../common/types/PublicChat'

import { createTodo, changeTodoCompletion } from '../store/chats/actionCreators'
import RootState from '../store/RootState'
import { ChatState } from '../store/chats/ChatsState'

interface TaskItemProps {
  todo: PublicTodo
  onToggle: (...args: any) => void
}

const TaskItem: React.FC<TaskItemProps> = ({
  todo,
  onToggle
}) => (
  <ListItem>
    <ListItemText
      primary={todo.title}
      secondary={todo.description}
    />

    <ListItemSecondaryAction>
      <Checkbox
        checked={todo.completed}
        onChange={() => onToggle()}
      />
    </ListItemSecondaryAction>
  </ListItem>
)

const mapStateToProps = (state: RootState): any => ({
  chats: state.chats.chatList
})

const mapDispatchToProps = {
  createTodo,
  changeTodoCompletion
}

export interface TodosModalProps {
  chatInfo: PublicChat

  chats?: ChatState[]
  createTodo?: (...args: any) => any
  changeTodoCompletion?: typeof changeTodoCompletion
}

const TodosModal: React.FC<TodosModalProps & ModalComponentProps<void>> = ({
  chatInfo,
  chats,
  createTodo,
  changeTodoCompletion,

  onResolve
}) => {
  const callNewTodoModal = useModal<{}, NewTodo>(NewTodoModal)

  const handleNewTodo = async (): Promise<void> => {
    try {
      const newTodo = await callNewTodoModal({})

      if (createTodo !== undefined) {
        createTodo({
          ...newTodo,

          chatId: chatInfo.id
        })
      }
    } catch (e) {}
  }

  const handleToggleTodo = (todo: PublicTodo): void => {
    changeTodoCompletion?.({
      id: todo.id,
      chatId: chatInfo.id,
      completed: !todo.completed
    })
  }

  return (
    <ModalWrapper
      onOutsideClick={onResolve}
    >
      <ModalContainer>
        <Header
          onClose={onResolve}
        >
          Tasks
        </Header>

        <Spacer />

        <Section>
          <List dense>
            {chats?.find((chat: ChatState) => chat.id === chatInfo.id)?.info?.todos.map(
              (todo: PublicTodo) => (
                <TaskItem
                  key={todo.id}
                  onToggle={() => handleToggleTodo(todo)}
                  todo={todo}
                />
              ))}
          </List>
        </Section>

        <Spacer />

        <Button
          variant='outlined'
          color='primary'
          onClick={handleNewTodo}
        >
          New task
        </Button>
      </ModalContainer>
    </ModalWrapper>
  )
}

const Spacer = styled.div`
  height: 15px;
`

export default connect(mapStateToProps, mapDispatchToProps)(TodosModal)
