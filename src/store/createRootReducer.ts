import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { History } from 'history'
import authReducer from './auth/authReducer'
import chatsReducer from './chats/chatsReducer'

const createRootReducer = (history: History): any => combineReducers({
  router: connectRouter(history),
  auth: authReducer,
  chats: chatsReducer
  // rest of reducers
})

export default createRootReducer
