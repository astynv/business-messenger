import * as React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background-color: white;
  height: 100%;

  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const NoMessages = styled.div`
  display: block;
  font-family: Montserrat, sans-serif;
  font-weight: bold;
`

const DialogPlaceholder: React.FC = () => (
  <Container>
    <NoMessages>Select or create a chat</NoMessages>
  </Container>
)

export default DialogPlaceholder
