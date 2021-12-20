import * as Sentry from '@sentry/react'

const assignError = (maybeError: any) => {
  if (typeof maybeError === 'string') {
    return new Error(maybeError)
  }
  if (typeof maybeError === 'object') {
    const error = new Error(maybeError?.message ?? String(maybeError))
    if (maybeError?.stack) {
      error.stack = maybeError.stack
    }
    if (maybeError?.code) {
      error.name = maybeError.code
    }
    return error
  }
  return maybeError
}

export const logError = (error: Error | unknown) => {
  if (error instanceof Error) {
    Sentry.captureException(error)
  } else {
    Sentry.captureException(assignError(error))
  }
  console.error(error)
}
