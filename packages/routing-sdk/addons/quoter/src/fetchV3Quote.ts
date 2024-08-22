import { V3Pool } from '@pancakeswap/routing-sdk-addon-v3'
import { ChainId } from '@pancakeswap/chains'
import { CurrencyAmount } from '@pancakeswap/swap-sdk-core'

import type { FetchQuote } from './types'
import { V3_QUOTER_ADDRESSES } from './constants'
import { quoterV2ABI } from './abis/IQuoterV2'
import { encodeRouteToPath } from './utils'

export const fetchV3Quote: FetchQuote<V3Pool> = async ({ route, client }) => {
  const { path, amount } = route
  const {
    currency: { chainId },
  } = amount
  const isExactOut = path[path.length - 1].wrapped.equals(amount.currency.wrapped)
  try {
    const result = await client.multicall({
      contracts: [
        {
          address: V3_QUOTER_ADDRESSES[chainId as ChainId],
          abi: quoterV2ABI,
          functionName: isExactOut ? 'quoteExactOutput' : 'quoteExactInput',
          args: [encodeRouteToPath(route, isExactOut), amount.quotient],
        },
      ],
      allowFailure: false,
    })

    const [[quote]] = result
    const outCurrency = isExactOut ? path[0] : path[path.length - 1]
    return CurrencyAmount.fromRawAmount(outCurrency, quote)
  } catch (err) {
    console.error('Failed to fetch v3 quote', err)
    return undefined
  }
}
