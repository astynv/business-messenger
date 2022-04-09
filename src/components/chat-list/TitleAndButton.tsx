import * as React from 'react'
import styled from 'styled-components'
import { useModal } from 'react-hooks-async-modal'
import NewChatModal, { NewChatModalProps } from '../../modals/NewChatModal'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const Title = styled.div`
  font-size: 2em;
  font-family: Montserrat, sans-serif;
  font-weight: bold;
`

const GradientButton = styled.button`
  font-size: 0.75em;
  padding: 0.25em 1em 0.25em 1em;

  background-image: linear-gradient(to left, #3188F1 0%, #C35ACD  51%, #3188F1  100%);
  text-align: center;
  transition: 0.5s;
  background-size: 200% auto;
  background-position: right;
  color: white;            
  box-shadow: 0 0 20px #eee;
  border-radius: 10px;
  display: block;
  outline: none;
  border: none;

  position: relative;

  cursor: pointer;

  box-shadow: 0px 0px 10px 0px #adadad;

  :hover {
    background-position: left center; /* change the direction of the change here */
    color: #fff;
    text-decoration: none;
  }

  :active {
    transform: translateY(1px);
  }
`

const ButtonIcon = styled.span`
  font-size: 2em;
  vertical-align: middle;
  padding-right: 0.2em;
  font-family: Montserrat, sans-serif;
  font-weight: bold;
`

const ButtonText = styled.span`
  vertical-align: middle;
  font-family: Montserrat, sans-serif;
  font-weight: bold;
`

const TitleAndButton: React.FC = () => {
  const callNewChatModal = useModal<NewChatModalProps>(NewChatModal)

  return (
    <Container>
      <Title>
        Chats
      </Title>
      <GradientButton onClick={async () => await callNewChatModal({})}>
        <ButtonIcon>+</ButtonIcon>
        <ButtonText>Create New Chat</ButtonText>
      </GradientButton>
    </Container>
  )
}

export default TitleAndButton
