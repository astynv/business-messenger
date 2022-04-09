import * as React from 'react'
import styled from 'styled-components'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

import Avatar from '../../Avatar'

TimeAgo.addLocale(en)

const timeAgo = new TimeAgo('en-US')

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1em;
  padding-bottom: 0em;
`

const Name = styled.span<{selected: boolean}>`
  font-size: 0.8em;
  margin-left: 1em;
  vertical-align: top;
  font-weight: bold;
  color: ${({ selected }) => selected ? 'white' : 'black'};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

const Time = styled.span<{selected: boolean}>`
  margin-left: auto;
  margin-top: 2px;
  padding-left: 5px;
  font-size: 0.7em;
  vertical-align: top;
  color: ${({ selected }) => selected ? 'white' : 'gray'};
  flex-shrink: 0;
`

interface AvatarNameTimeProps {
  avatar: string | null
  name: string
  date: Date

  selected: boolean
}

const AvatarNameTime: React.FC<AvatarNameTimeProps> = props => (
  <Container>
    <Avatar
      avatar={props.avatar}
      title={props.name}
    />
    <Name selected={props.selected}>{props.name}</Name>
    <Time selected={props.selected}>{timeAgo.format(props.date)}</Time>
  </Container>
)

export default AvatarNameTime
