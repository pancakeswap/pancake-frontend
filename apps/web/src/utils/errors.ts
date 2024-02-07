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

export class UserUnexpectedTxError extends BaseError {
  override name = 'UserUnexpectedTxError'

  constructor({ expectedData, actualData }: { expectedData: unknown; actualData: unknown }) {
    super('User initiated unexpected transaction', {
      metaMessages: [
        `User initiated unexpected transaction`,
        ``,
        `  Expected data: ${expectedData}`,
        `  Actual data: ${actualData}`,
      ],
    })
  }
}
