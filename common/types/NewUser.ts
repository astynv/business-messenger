import emailRe from '../utils/emailRe'

export default interface NewUser {
  username: string
  email: string
  password: string
  userAgent: string
  firstName: string
  lastName: string
}

export function isNewUser (newUser: any): [is: boolean, reason?: string] {
  if (typeof newUser !== 'object') {
    return [false, 'newUser is not an object']
  }

  if (typeof newUser.username !== 'string') {
    return [false, 'newUser.username is not a string']
  }
  if (newUser.username.length < 5) {
    return [false, 'username must be be at least 5 characters']
  }
  if (newUser.username.length > 32) {
    return [false, 'username must be be at most 32 characters']
  }
  if (!/[a-z0-9_]{5,}/i.test(newUser.username)) {
    return [false, 'username must consist only of latin letters, digits and underscores']
  }

  if (typeof newUser.email !== 'string') {
    return [false, 'newUser.email is not a string']
  }
  if (newUser.email.length > 256) {
    return [false, 'email must be at most 256 characters']
  }
  if (!emailRe.test(newUser.email)) {
    return [false, 'invalid email']
  }

  if (typeof newUser.password !== 'string') {
    return [false, 'newUser.password is not a string']
  }
  if (newUser.password.length < 8) {
    return [false, 'password must be at least 8 characters']
  }
  if (newUser.password.length > 1024) {
    return [false, 'password must be at most 1024 characters']
  }

  if (typeof newUser.userAgent !== 'string') {
    return [false, 'newUser.userAgent is not a string']
  }
  if (newUser.userAgent.length > 1024) {
    return [false, 'userAgent must be at most 1024 characters']
  }

  if (typeof newUser.firstName !== 'string') {
    return [false, 'newUser.firstName is not a string']
  }
  if (newUser.firstName.length < 1) {
    return [false, 'first name must be be at least 1 character']
  }
  if (newUser.firstName.length > 64) {
    return [false, 'first name must be at most 64 characters']
  }

  if (typeof newUser.lastName !== 'string') {
    return [false, 'newUser.lastName is not a string']
  }
  if (newUser.lastName.length < 1) {
    return [false, 'last name must be be at least 1 character']
  }
  if (newUser.lastName.length > 64) {
    return [false, 'last name must be at most 64 characters']
  }

  return [true]
}
