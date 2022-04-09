import * as React from 'react'
import styled from 'styled-components'
import Picker from 'emoji-picker-react'
import OutsideClickHandler from 'react-outside-click-handler'

import emojiIcon from '../../icons/emoji-icon.png'
import scrollbarStyle from '../scrollbarStyle'

const EmojiButton = styled.button`
  margin: 1em;
  width: 2em;
  height: 2em;
  position: relative;
  background: none;
  outline: none;
  border: none;
  cursor: pointer;

  img {
    object-fit: cover;
    height: inherit;
    width: inherit;
    filter: contrast(10%);
  }
`

const EmojiPickerContainerOuter = styled.div<{shown: boolean}>`
  display: ${({ shown }) => shown ? 'block' : 'none'};
  position: relative;
  user-select: none;
`

const EmojiPickerContainerInner = styled.div`
  position: absolute;
  bottom: 1em;
  right: 1em;

  * {
    ${scrollbarStyle}
  }
`

interface EmojiPickerProps {
  onPicked: (emoji: string) => void
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onPicked
}) => {
  const [renderEmjPick, setEmjPick] = React.useState(false)

  return (
    <div>
      <EmojiButton onClick={_ => setEmjPick(!renderEmjPick)}>
        <img src={emojiIcon} alt='Emoji' />
      </EmojiButton>
      <EmojiPickerContainerOuter shown={renderEmjPick}>
        <OutsideClickHandler onOutsideClick={() => setEmjPick(false)}>
          <EmojiPickerContainerInner>
            <Picker
              onEmojiClick={(event, obj) => onPicked(obj.emoji)}
            />
          </EmojiPickerContainerInner>
        </OutsideClickHandler>
      </EmojiPickerContainerOuter>
    </div>
  )
}

export default EmojiPicker
