import React from 'react'
import styled from 'styled-components'

import IconButton from '@material-ui/core/IconButton'
import ClearIcon from '@material-ui/icons/Clear'

export const ModalContainer = styled.div`
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

interface HeaderProps {
  onClose: (...args: any) => void
}

export const Header: React.FC<HeaderProps> = ({
  children,
  onClose
}) => (
  <HeaderContainer>
    <div>{children}</div>
    <IconButton
      edge='end'
      aria-label='close'
      size='small'
      onClick={() => onClose()}
    >
      <ClearIcon />
    </IconButton>
  </HeaderContainer>
)
const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin: -15px;
  margin-bottom: 0;
  padding: 15px;
  padding-bottom: 10px;
  justify-content: space-between;
  border-bottom: 2px solid #f0f0f0;
  font-weight: bold;
  color: #4784f0;
  font-size: 24px;
  height: 40px;
`

export const Label = styled.div`
  margin: 15px 15px 5px;
  font-size: 18px;
  color: #767676;
`

export const Section = styled.div`
  background-color: #f0f0f0;
  border-radius: 10px;
`
