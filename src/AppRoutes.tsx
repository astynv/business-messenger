import React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'

import RootState from './store/RootState'
import AuthState from './store/auth/AuthState'

import DialogPage from './pages/DialogPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'

const mapStateToProps = (state: RootState): any => {
  return {
    auth: state.auth
  }
}

interface AppRoutesProps {
  auth?: AuthState
}

const AppRoutes: React.FC<AppRoutesProps> = ({
  auth
}) => {
  // auth никогда не null, но если его так указать, надо ебаться с тайпскриптом
  /* eslint-disable @typescript-eslint/no-non-null-assertion */

  const {
    fetched,
    loggedIn
  } = auth!

  if (!fetched) {
    return <div>Loading</div> // todo proper
  }

  if (loggedIn!) {
    return (
      <Switch>
        <Route path='/login'>
          <Redirect to='/chat' />
        </Route>
        <Route path='/signup'>
          <Redirect to='/chat' />
        </Route>

        {/* add new routes here */}
        <Route path='/chat/:chatId'>
          <DialogPage />
        </Route>
        <Route path='/chat'>
          <DialogPage />
        </Route>
        <Route path='/'>
          <Redirect to='/chat' />
        </Route>
      </Switch>
    )
  } else {
    return (
      <Switch>
        <Route path='/login'>
          <LoginPage />
        </Route>
        <Route path='/signup'>
          <SignUpPage />
        </Route>
        <Route path='/'>
          <Redirect to='/login' />
        </Route>
      </Switch>
    )
  }
}

export default connect(mapStateToProps)(AppRoutes)
