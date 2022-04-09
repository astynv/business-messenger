import { Action } from 'redux'

import RootState from '../RootState'

import Login from '../../common/types/Login'
import NewUser from '../../common/types/NewUser'
import { loginApi, signUpApi, userApi } from '../../utils/api'

import ThunkAction from '../ThunkAction'
import ActionTypes from '../ActionTypes'
import {
  HydrateAuthAction,
  LoginFailedAction,
  LoginSuccessAction,
  HideLoginFailedAction,
  HideSignUpFailedAction,
  SignUpFailedAction
} from './AuthActions'
import { hydrateChats } from '../chats/actionCreators'
import connectWebsocket from '../../connectWebsocket'

export const hydrateAuth = () => async (dispatch: (action: Action | ThunkAction) => any, getState: () => RootState) => {
  const [user, error] = await userApi()

  if (error !== null) {
    const action: HydrateAuthAction = {
      type: ActionTypes.HYDRATE_AUTH,
      user: null
    }
    dispatch(action)
  } else if (user !== null) {
    const action: HydrateAuthAction = {
      type: ActionTypes.HYDRATE_AUTH,
      user: { ...user }
    }
    dispatch(action)
    dispatch(hydrateChats() as ThunkAction)

    // eslint-disable-next-line no-void
    void connectWebsocket(dispatch)
  }
}

export const tryLogin = (login: Login) => async (dispatch: (action: Action | ThunkAction) => any, getState: () => RootState) => {
  const [user, error] = await loginApi(login)

  if (error !== null) {
    const action: LoginFailedAction = {
      type: ActionTypes.LOGIN_FAILED
    }
    dispatch(action)
  } else if (user !== null) {
    const action: LoginSuccessAction = {
      type: ActionTypes.LOGIN_SUCCESS,
      user: { ...user }
    }
    dispatch(action)
    dispatch(hydrateChats() as ThunkAction)

    // eslint-disable-next-line no-void
    void connectWebsocket(dispatch)
  }
}

export const hideLoginFailed = (): HideLoginFailedAction => ({
  type: ActionTypes.HIDE_LOGIN_FAILED
})

export const trySignUp = (newUser: NewUser) => async (dispatch: (action: Action | ThunkAction) => any, getState: () => RootState) => {
  const [user, error] = await signUpApi(newUser)

  if (error !== null) {
    const action: SignUpFailedAction = {
      type: ActionTypes.SIGN_UP_FAILED,
      reason: error.message
    }
    dispatch(action)
  } else if (user !== null) {
    const action: LoginSuccessAction = {
      type: ActionTypes.LOGIN_SUCCESS,
      user: { ...user }
    }
    dispatch(action)
    dispatch(hydrateChats() as ThunkAction)

    // eslint-disable-next-line no-void
    void connectWebsocket(dispatch)
  }
}

export const hideSignUpFailed = (): HideSignUpFailedAction => ({
  type: ActionTypes.HIDE_SIGN_UP_FAILED
})
