import { TimeoutError, BaseError } from 'viem'

export function isViemAbortError(e: any) {
  return e instanceof BaseError && e.walk((err) => err instanceof TimeoutError) instanceof TimeoutError
}
