import { BaseError, UnknownRpcError } from 'viem'

export function parseViemError<TError>(err: TError): BaseError | null {
  if (err instanceof BaseError) {
    return err
  }
  if (typeof err === 'string') {
    return new UnknownRpcError(new Error(err))
  }
  if (err instanceof Error) {
    return new UnknownRpcError(err)
  }
  return null
}

export function getViemErrorMessage(err: any) {
  const error = parseViemError(err)
  if (error) {
    return error.details || error.shortMessage
  }
  return String(err)
}
