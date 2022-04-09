import React, { useState } from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'

import getUserAgent from '../utils/getUserAgent'
import Login, { isLogin } from '../common/types/Login'
import RootState from '../store/RootState'
import AuthState from '../store/auth/AuthState'
import {
  hideLoginFailed,
  tryLogin
} from '../store/auth/actionCreators'

import {
  AuthFormLogo,
  AuthFormContainer,
  AuthFormUI,
  AuthFormUISpacer,
  AuthFormError
} from '../components/auth-pages/AuthForm'

const mapStateToProps = (state: RootState): any => {
  return {
    auth: state.auth
  }
}

const mapDispatchToProps = {
  push,

  hideLoginFailed,
  tryLogin
}

interface LoginPageProps {
  push?: typeof push

  hideLoginFailed?: typeof hideLoginFailed
  tryLogin?: typeof tryLogin

  auth?: AuthState
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */

const LoginPage: React.FC<LoginPageProps> = ({
  push,

  hideLoginFailed,
  tryLogin,

  auth
}) => {
  const [login, setLogin] = useState<Login>({
    email: '',
    password: '',
    userAgent: getUserAgent()
  })
  const [error, setError] = useState('')

  const setEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLogin({
      ...login,
      email: e.target.value
    })
    if (auth!.failedLoginTrial) {
      hideLoginFailed!()
    }
    setError('')
  }

  const setPassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLogin({
      ...login,
      password: e.target.value
    })
    if (auth!.failedLoginTrial) {
      hideLoginFailed!()
    }
    setError('')
  }

  const handleLogin = (): void => {
    const [, error] = isLogin(login)

    if (error !== undefined) {
      setError(error)
      return
    }

    tryLogin!(login)
  }

  return (
    <AuthFormContainer>
      <AuthFormLogo>Messenger&trade;</AuthFormLogo>
      <TextField
        label='E-mail'
        type='email'
        placeholder='mail@example.com'
        variant='outlined'
        margin='normal'
        fullWidth
        value={login.email}
        onChange={setEmail}
      />
      <TextField
        label='Password'
        type='password'
        variant='outlined'
        margin='normal'
        fullWidth
        value={login.password}
        onChange={setPassword}
      />
      {
        (
          error !== '' ||
          auth!.failedLoginTrial
        ) && (
          <AuthFormError>
            <ErrorOutlineIcon />
            <div>
              {error}
              {auth!.failedLoginTrial && 'invalid email or password'}
            </div>
          </AuthFormError>
        )
      }
      <AuthFormUI>
        <Button
          variant='text'
          color='secondary'
          size='large'
          onClick={() => push!('/signup')}
        >
          I haven't signed up
        </Button>
        <AuthFormUISpacer />
        <Button
          variant='outlined'
          color='primary'
          size='large'
          onClick={handleLogin}
        >
          Log in
        </Button>
      </AuthFormUI>

    </AuthFormContainer>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage)
