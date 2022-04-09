import React from 'react'
import styled from 'styled-components'
// import OutsideClickHandler from 'react-outside-click-handler'

interface ModalWrapperProps {
  onOutsideClick: (...args: any) => void
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  children,
  onOutsideClick
}) => (
  <ModalBackground>
    {/* <OutsideClickHandler onOutsideClick={() => onOutsideClick()}> */}
    <ModalContainer>
      {children}
    </ModalContainer>
    {/* </OutsideClickHandler> */}
  </ModalBackground>
)

const ModalBackground = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;

  background-color: #00000082;
  
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
`

const ModalContainer = styled.div`
  cursor: initial;
`

export default ModalWrapper
