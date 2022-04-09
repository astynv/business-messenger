import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import PersonIcon from '@material-ui/icons/Person'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import ClearIcon from '@material-ui/icons/Clear'
import AddIcon from '@material-ui/icons/Add'

import PublicUser from '../../common/types/PublicUser'

interface UserListItemProps {
  selected?: boolean
  onToggle?: (id: string) => void
}

const UserListItem: React.FC<PublicUser & UserListItemProps> = ({
  id,
  firstName,
  lastName,
  username,

  selected = false,
  onToggle
}) => (
  <ListItem>
    <ListItemAvatar>
      <Avatar>
        <PersonIcon />
      </Avatar>
    </ListItemAvatar>
    <ListItemText
      primary={firstName + ' ' + lastName}
      secondary={'@' + username}
    />
    {onToggle !== undefined && (
      <ListItemSecondaryAction>
        <IconButton
          edge='end'
          aria-label='delete'
          onClick={() => onToggle(id)}
        >
          {selected
            ? <ClearIcon />
            : <AddIcon />}
        </IconButton>
      </ListItemSecondaryAction>
    )}
  </ListItem>
)

export default UserListItem
