export default interface AuthState {
  fetched: boolean

  loggedIn?: boolean
  id?: string
  username?: string
  firstName?: string
  lastName?: string
  lastSeen?: Date

  failedLoginTrial: boolean

  failedSignUpTrial: boolean
  failedSignUpReason?: string
}

export const defaultAuthState: AuthState = {
  fetched: false,
  failedLoginTrial: false,
  failedSignUpTrial: false
}
