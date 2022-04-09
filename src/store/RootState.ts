import { RouterState } from 'connected-react-router'
import AuthState from './auth/AuthState'
import ChatsState from './chats/ChatsState'

export default interface RootState {
  router: RouterState
  auth: AuthState
  chats: ChatsState
}
