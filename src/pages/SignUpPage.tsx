import React, { useState } from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'

import getUserAgent from '../utils/getUserAgent'
import NewUser, { isNewUser } from '../common/types/NewUser'
import RootState from '../store/RootState'
import AuthState from '../store/auth/AuthState'
import {
  trySignUp,
  hideSignUpFailed
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

  trySignUp,
  hideSignUpFailed
}

interface SignUpPageProps {
  push?: typeof push

  trySignUp?: typeof trySignUp
  hideSignUpFailed?: typeof hideSignUpFailed

  auth?: AuthState
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */

const SignUpPage: React.FC<SignUpPageProps> = ({
  push,

  trySignUp,
  hideSignUpFailed,

  auth
}) => {
  const [newUser, setNewUser] = useState<NewUser>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    userAgent: getUserAgent()
  })
  const [error, setError] = useState('')

  const setUsername = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewUser({
      ...newUser,
      username: e.target.value
    })
    if (auth!.failedSignUpTrial) {
      hideSignUpFailed!()
    }
    setError('')
  }

  const setFirstName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewUser({
      ...newUser,
      firstName: e.target.value
    })
    if (auth!.failedSignUpTrial) {
      hideSignUpFailed!()
    }
    setError('')
  }

  const setLastName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewUser({
      ...newUser,
      lastName: e.target.value
    })
    if (auth!.failedSignUpTrial) {
      hideSignUpFailed!()
    }
    setError('')
  }

  const setEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewUser({
      ...newUser,
      email: e.target.value
    })
    if (auth!.failedSignUpTrial) {
      hideSignUpFailed!()
    }
    setError('')
  }

  const setPassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewUser({
      ...newUser,
      password: e.target.value
    })
    if (auth!.failedSignUpTrial) {
      hideSignUpFailed!()
    }
    setError('')
  }

  const handleSignUp = (): void => {
    const [, error] = isNewUser(newUser)

    if (error !== undefined) {
      setError(error)
      return
    }

    trySignUp!(newUser)
  }

  return (
    <AuthFormContainer>
      <AuthFormLogo>Messenger&trade;</AuthFormLogo>
      <TextField
        label='Username'
        type='text'
        placeholder='skyferry17'
        variant='outlined'
        margin='normal'
        fullWidth
        value={newUser.username}
        onChange={setUsername}
      />
      <TextField
        label='FirstName'
        type='text'
        placeholder='Anastasia'
        variant='outlined'
        margin='normal'
        fullWidth
        value={newUser.firstName}
        onChange={setFirstName}
      />
      <TextField
        label='LastName'
        type='text'
        placeholder='Yuneeva'
        variant='outlined'
        margin='normal'
        fullWidth
        value={newUser.lastName}
        onChange={setLastName}
      />
      <TextField
        label='E-mail'
        type='email'
        placeholder='mail@example.com'
        variant='outlined'
        margin='normal'
        fullWidth
        value={newUser.email}
        onChange={setEmail}
      />
      <TextField
        label='Password'
        type='password'
        variant='outlined'
        margin='normal'
        fullWidth
        value={newUser.password}
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
              {auth!.failedSignUpTrial && auth!.failedSignUpReason}
            </div>
          </AuthFormError>
        )
      }
      <AuthFormUI>
        <Button
          variant='text'
          color='secondary'
          size='large'
          onClick={() => push!('/login')}
        >
          I already signed up
        </Button>
        <AuthFormUISpacer />
        <Button
          variant='outlined'
          color='primary'
          size='large'
          onClick={handleSignUp}
        >
          Sign up
        </Button>
      </AuthFormUI>
    </AuthFormContainer>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpPage)
