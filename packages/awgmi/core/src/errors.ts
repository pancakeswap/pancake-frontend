import { Types } from 'aptos'

export class ConnectorAlreadyConnectedError extends Error {
  name = 'ConnectorAlreadyConnectedError'
  message = 'Connector already connected'
}

export class ConnectorNotFoundError extends Error {
  name = 'ConnectorNotFoundError'

  message = 'Connector not found'
}

export class ChainMismatchError extends Error {
  name = 'ChainMismatchError'

  constructor({ activeChain, targetChain }: { activeChain: string; targetChain: string }) {
    super(`Chain mismatch: Expected "${targetChain}", received "${activeChain}".`)
  }
}

export class SimulateTransactionError extends Error {
  name = 'SimulateTransactionError'
  tx: Types.UserTransaction

  constructor(tx: Types.UserTransaction) {
    super(`Simulate Transaction Error version: ${tx.version}`)
    this.tx = tx
  }
}

/**
 * Error subclass implementing JSON RPC 2.0 errors and Ethereum RPC errors per EIP-1474.
 * @see https://eips.ethereum.org/EIPS/eip-1474
 */
export class RpcError<T = undefined> extends Error {
  readonly code: number
  readonly data?: T
  readonly internal?: unknown

  constructor(
    /** Number error code */
    code: number,
    /** Human-readable string */
    message: string,
    /** Low-level error */
    internal?: unknown,
    /** Other useful information about error */
    data?: T,
  ) {
    if (!Number.isInteger(code)) throw new Error('"code" must be an integer.')
    if (!message || typeof message !== 'string') throw new Error('"message" must be a nonempty string.')

    super(message)
    this.code = code
    this.data = data
    this.internal = internal
  }
}

/**
 * @TODO: atpos review the provider error
 * Error subclass implementing Ethereum Provider errors per EIP-1193.
 * @see https://eips.ethereum.org/EIPS/eip-1193
 */
export class ProviderRpcError<T = undefined> extends RpcError<T> {
  /**
   * Create an Ethereum Provider JSON-RPC error.
   * `code` must be an integer in the 1000 <= 4999 range.
   */
  constructor(
    /**
     * Number error code
     * @see https://eips.ethereum.org/EIPS/eip-1193#error-standards
     */
    code: 4001 | 4100 | 4200 | 4900 | 4901 | 4902,
    /** Human-readable string */
    message: string,
    /** Low-level error */
    internal?: unknown,
    /** Other useful information about error */
    data?: T,
  ) {
    if (!(Number.isInteger(code) && code >= 1000 && code <= 4999))
      throw new Error('"code" must be an integer such that: 1000 <= code <= 4999')

    super(code, message, internal, data)
  }
}

export class UserRejectedRequestError extends ProviderRpcError {
  name = 'UserRejectedRequestError'

  constructor(error: unknown) {
    super(4001, 'User rejected request', error)
  }
}
