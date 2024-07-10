import { UserRejectedRequestError } from 'viem'

const possibleRejectMessage = ['Cancelled by User', 'cancel', 'Transaction was rejected', 'denied']

// provider user rejected error code
export const isUserRejected = (err: any): any => {
  if (err instanceof UserRejectedRequestError) {
    return true
  }
  if ('details' in err) {
    // fallback for some wallets that don't follow EIP 1193, trust, safe
    if (possibleRejectMessage.some((msg) => err.details?.includes(msg))) {
      return true
    }
  }

  // fallback for raw rpc error code
  if (err && typeof err === 'object') {
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
