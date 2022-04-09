import * as React from 'react'
import styled from 'styled-components'

const ImageAvatar = styled.img`
  object-fit: cover;
  height: 50px;
  width: 50px;
  border-radius: 25px;
`

const TypographicAvatar = styled.div`
  height: 50px;
  width: 50px;
  border-radius: 25px;
  background: linear-gradient(40deg,#ED7DEB 19%,#3188F1 105%);
  flex-shrink: 0;
`

const TypographicAvatarText = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  text-align: center;
  font-size: 19px;
  margin-top: 14px;
  color: white;
  text-shadow: 0 0 8px #00000091;
`

interface AvatarProps {
  avatar: string | null
  title: string
}

const Avatar: React.FC<AvatarProps> = ({ avatar, title }) => (
  avatar !== null
    ? <ImageAvatar src={avatar} />
    : (
      <TypographicAvatar>
        <TypographicAvatarText>{title.split(' ').slice(0, 2).map(word => word[0].toLocaleUpperCase())}</TypographicAvatarText>
      </TypographicAvatar>
    )
)

export default Avatar
