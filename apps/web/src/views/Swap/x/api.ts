import { observe } from '@pancakeswap/utils/observe'
import { BaseError, isHash, stringify, type Address, type Hash, type Hex } from 'viem'

export type XOrderStatus = 'OPEN' | 'PENDING' | 'EXPIRED' | 'FILLED'

export type GetXOrderReceiptResponseOrder = {
  input: {
    token: Address
    startAmount: string
    endAmount: string
  }
  outputs: {
    token: Address
    amount: string
    endAmount: string
    recipient: Address
  }[]
  hash: Hash
  chainId: number
  status: XOrderStatus
  deadline: string
  decayStartTime: string
  decayEndTime: string
  transactionHash: Hash | null
  blockNumber: number | null
  nonce: string
  createdAt: string
  updatedAt: string
}

export type GetXOrderReceiptResponse = {
  order: GetXOrderReceiptResponseOrder
}

export type GetXOrdersResponse = {
  orders: GetXOrderReceiptResponseOrder[]
}

export const getRecentXOrders = async (chainId: number, address: Address) => {
  const resp = await fetch(
    `https://sgp1.test.x.pancakeswap.com/order-handler/orders?chainId=${chainId}&offerer=${address}`,
  )

  const data = (await resp.json()) as GetXOrdersResponse
  return data
}

export const getXOrderReceipt = async (chainId: number, hash: Hash) => {
  const resp = await fetch(`https://sgp1.test.x.pancakeswap.com/order-handler/order/${chainId}/${hash}`)

  const receipt = (await resp.json()) as GetXOrderReceiptResponse
  return receipt
}

export class WaitForXOrderReceiptTimeoutError extends BaseError {
  override name = 'WaitForXOrderReceiptTimeoutError'

  constructor({ hash }: { hash: Hash }) {
    super(`Timed out while waiting for transaction with hash "${hash}" to be confirmed.`)
  }
}

export type WaitForXOrderReceiptParameter = {
  chainId: number
  /** The hash of the transaction. */
  hash: Hash
  /**
   * Polling frequency (in ms). Defaults to the client's pollingInterval config.
   * @default client.pollingInterval
   */
  pollingInterval?: number
  /** Optional timeout (in milliseconds) to wait before stopping polling. */
  timeout?: number
}

export const waitForXOrderReceipt = ({
  chainId,
  hash,
  pollingInterval = 5_000,
  timeout,
}: WaitForXOrderReceiptParameter): Promise<GetXOrderReceiptResponse['order']> => {
  const observerId = stringify(['waitForXOrderReceipt', hash])

  let userOperationReceipt: GetXOrderReceiptResponse

  return new Promise((resolve, reject) => {
    const unobserve = observe(observerId, { resolve, reject }, async (emit) => {
      let timeoutTimer: ReturnType<typeof setTimeout>

      const _removeInterval = setInterval(async () => {
        const done = (fn: () => void) => {
          clearInterval(_removeInterval)
          fn()
          unobserve()
          if (timeout) clearTimeout(timeoutTimer)
        }
        try {
          const receipt = await getXOrderReceipt(chainId, hash)

          if (receipt.order) {
            if (receipt.order.status !== 'OPEN') {
              userOperationReceipt = receipt
            }
          }

          if (!!receipt.order && receipt.order.status !== 'OPEN') {
            userOperationReceipt = receipt
          }

          if (userOperationReceipt) {
            done(() => emit.resolve(userOperationReceipt.order))
          }
        } catch (err) {
          done(() => emit.reject(err))
        }
      }, pollingInterval)

      if (timeout) {
        timeoutTimer = setTimeout(() => {
          clearInterval(_removeInterval)
          unobserve()
          reject(
            new WaitForXOrderReceiptTimeoutError({
              hash,
            }),
          )
          clearTimeout(timeoutTimer)
        }, timeout)
      }
    })
  })
}

export const submitXOrder = async ({
  encodedOrder,
  chainId,
  signature,
}: {
  encodedOrder: Hex
  chainId: number
  signature: Hex
}) => {
  const resp = await fetch('https://sgp1.test.x.pancakeswap.com/order-handler/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      encodedOrder,
      chainId,
      signature,
    }),
  })

  const res = await resp.json()
  if (!resp.ok) {
    throw new Error(res?.detail ?? 'Failed to submit order')
  }

  const { hash } = res

  if (!hash || !isHash(hash)) {
    throw new Error('Invalid hash')
  }

  return { hash, chainId }
}
