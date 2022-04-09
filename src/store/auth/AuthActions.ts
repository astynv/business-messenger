import { Action } from 'redux'

import PublicUser from '../../common/types/PublicUser'
import ActionTypes from '../ActionTypes'

export interface HydrateAuthAction extends Action<ActionTypes> {
  type: ActionTypes.HYDRATE_AUTH
  user: PublicUser | null
}

export interface LoginSuccessAction extends Action<ActionTypes> {
  type: ActionTypes.LOGIN_SUCCESS
  user: PublicUser
}

export interface LoginFailedAction extends Action<ActionTypes> {
  type: ActionTypes.LOGIN_FAILED
}

export interface HideLoginFailedAction extends Action<ActionTypes> {
  type: ActionTypes.HIDE_LOGIN_FAILED
}

export interface SignUpFailedAction extends Action<ActionTypes> {
  type: ActionTypes.SIGN_UP_FAILED
  reason: string
}

export interface HideSignUpFailedAction extends Action<ActionTypes> {
  type: ActionTypes.HIDE_SIGN_UP_FAILED
}

type AuthAction = (
  HydrateAuthAction |
  LoginSuccessAction |
  LoginFailedAction |
  HideLoginFailedAction |
  SignUpFailedAction |
  HideSignUpFailedAction
)

export default AuthAction
