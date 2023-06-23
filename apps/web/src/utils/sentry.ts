import { captureException } from '@sentry/nextjs'
import { UserRejectedRequestError, UnknownRpcError } from 'viem'

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

const possibleRejectMessage = ['Cancelled by User', 'cancel', 'Transaction was rejected']

// provider user rejected error code
export const isUserRejected = (err) => {
  if (err instanceof UserRejectedRequestError) {
    return true
  }
  if (err instanceof UnknownRpcError) {
    // fallback for some wallets that don't follow EIP 1193, trust, safe
    if (possibleRejectMessage.some((msg) => err.details?.includes(msg))) {
      return true
    }
  }

  // fallback for raw rpc error code
  if (typeof err === 'object') {
    if (
      ('code' in err && (err.code === 4001 || err.code === 'ACTION_REJECTED')) ||
      ('cause' in err && 'code' in err.cause && err.cause.code === 4001)
    ) {
      return true
    }

    if ('cause' in err) {
      return isUserRejected(err.cause)
    }
  }
  return false
}

const ENABLED_LOG = false

export const logError = (error: Error | unknown) => {
  if (ENABLED_LOG) {
    if (error instanceof Error) {
      captureException(error)
    } else {
      captureException(assignError(error), error)
    }
  }
  console.error(error)
}
