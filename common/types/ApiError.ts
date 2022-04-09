export default interface ApiError {
  message: string
}

export function isApiError (apiError: any): boolean {
  if (typeof apiError !== 'object') {
    return false
  }

  if (typeof apiError.message !== 'string') {
    return false
  }

  return true
}
