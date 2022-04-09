import * as React from 'react'
import styled from 'styled-components'

import sendIcon from '../../icons/send-icon.png'

const StyledButton = styled.button`
  padding: 0 !important;
  margin-left: 0.5em;
  flex-shrink: 0;
  font-size: 1em;
  width: 1.75em;
  height: 1.75em;
  border-radius: 2em;
  border: none;
  outline: none;
  background: linear-gradient(135deg, rgba(115,179,241,1) 0%, rgba(52,139,231,1) 100%);
  cursor: pointer;
  box-shadow: 0px 0px 10px 0px rgba(52,139,231,0.53);

  img {
    object-fit: cover;
    width: 0.75em;
    height: 0.75em;
    filter: brightness(10000%);
  }

  transition: transform 0.1s linear;

  :active {
    transform: translateY(0.1em);
  }
`

interface SendButtonProps {
  onClick: () => void
}

const SendButton: React.FC<SendButtonProps> = ({ onClick }) => (
  <StyledButton
    onClick={() => onClick()}
  >
    <img src={sendIcon} alt='Send' />
  </StyledButton>
)

export default SendButton
