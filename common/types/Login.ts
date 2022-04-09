import emailRe from '../utils/emailRe'

export default interface Login {
  email: string
  password: string
  userAgent: string
}

export function isLogin (login: any): [is: boolean, reason?: string] {
  if (typeof login !== 'object') {
    return [false, 'login is not an object']
  }

  if (typeof login.email !== 'string') {
    return [false, 'newUser.email is not a string']
  }
  if (login.email.length > 256) {
    return [false, 'email must be at most 256 characters']
  }
  if (!emailRe.test(login.email)) {
    return [false, 'invalid email']
  }

  if (typeof login.password !== 'string') {
    return [false, 'login.password is not a string']
  }
  if (login.password.length < 8) {
    return [false, 'password must be at least 8 characters']
  }
  if (login.password.length > 1024) {
    return [false, 'password must be at most 1024 characters']
  }

  if (typeof login.userAgent !== 'string') {
    return [false, 'login.userAgent is not a string']
  }
  if (login.userAgent.length > 1024) {
    return [false, 'userAgent must be at most 1024 characters']
  }

  return [true]
}
