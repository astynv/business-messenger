import * as React from 'react'
import styled from 'styled-components'
import TextareaAutosize from 'react-textarea-autosize'

import scrollbarStyle from '../scrollbarStyle'

const StyledInput = styled(TextareaAutosize)`
  width: 100%;
  border: none;
  outline: none;
  font-size: 0.6em;
  max-height: 10em;
  resize: none;
  padding-right: 1em;

  ${scrollbarStyle}
`

interface InputBoxProps {
  value: string
  onChange: (value: string) => void
  onEnterPress: () => void
}

const InputBox: React.FC<InputBoxProps> = ({
  value,
  onChange,
  onEnterPress
}) => (
  <StyledInput
    value={value}
    onChange={e => onChange(e.target.value)}
    onKeyDown={e => {
      if (e.key === 'Enter') {
        e.preventDefault()
        onEnterPress()
      }
    }}
    placeholder='Type a message here'
    autoFocus
  />
)

export default InputBox
