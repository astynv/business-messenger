import AuthAction from './AuthActions'
import AuthState, { defaultAuthState } from './AuthState'
import ActionTypes from '../ActionTypes'

export default function authReducer (state: AuthState = defaultAuthState, action?: AuthAction): AuthState {
  if (action === undefined) {
    return state
  }

  switch (action.type) {
    case ActionTypes.HYDRATE_AUTH: {
      const { user } = action

      if (user === null) {
        return {
          ...state,

          fetched: true,
          loggedIn: false
        }
      }

      return {
        ...state,

        fetched: true,
        loggedIn: true,

        ...user
      }
    }
    case ActionTypes.LOGIN_SUCCESS: {
      const { user } = action

      return {
        ...state,

        fetched: true,
        loggedIn: true,

        ...user
      }
    }
    case ActionTypes.LOGIN_FAILED: {
      return {
        ...state,

        failedLoginTrial: true
      }
    }
    case ActionTypes.HIDE_LOGIN_FAILED: {
      return {
        ...state,

        failedLoginTrial: false
      }
    }
    case ActionTypes.SIGN_UP_FAILED: {
      return {
        ...state,

        failedSignUpTrial: true,
        failedSignUpReason: action.reason
      }
    }
    case ActionTypes.HIDE_SIGN_UP_FAILED: {
      return {
        ...state,

        failedSignUpTrial: true,
        failedSignUpReason: undefined
      }
    }
    default: {
      return state
    }
  }
}
