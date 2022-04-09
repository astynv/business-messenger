import { createBrowserHistory } from 'history'
import { applyMiddleware, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import createRootReducer from './createRootReducer'

export const history = createBrowserHistory()

function configureStore (preloadedState?: any): any {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    composeWithDevTools(
      applyMiddleware(
        // for dispatching history actions
        routerMiddleware(history),

        // for async actions
        thunk
      )
    )
  )

  return store
}

const store = configureStore()

export default store
