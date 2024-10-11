import { StablePool } from '@pancakeswap/routing-sdk-addon-stable-swap'
import { V2Pool } from '@pancakeswap/routing-sdk-addon-v2'
import { V3Pool } from '@pancakeswap/routing-sdk-addon-v3'
import { ChainId } from '@pancakeswap/chains'
import { CurrencyAmount } from '@pancakeswap/swap-sdk-core'

import type { FetchQuote, QuoteRoute } from './types'
import { V3_QUOTER_ADDRESSES } from './constants'
import { quoterV2ABI } from './abis/IQuoterV2'
import { encodeRouteToPath } from './utils'

export type SupportedPool = V3Pool | V2Pool | StablePool

export function buildV3QuoteCall<P extends SupportedPool = SupportedPool>(route: QuoteRoute<P>) {
  const { path, amount } = route
  const {
    currency: { chainId },
  } = amount
  const isExactOut = path[path.length - 1].wrapped.equals(amount.currency.wrapped)
  return {
    address: V3_QUOTER_ADDRESSES[chainId as ChainId],
    abi: quoterV2ABI,
    functionName: isExactOut ? 'quoteExactOutput' : 'quoteExactInput',
    args: [encodeRouteToPath(route, isExactOut), amount.quotient],
  } as const
}

export const fetchV3Quote: FetchQuote<SupportedPool> = async ({ route, client }) => {
  const { path, amount } = route
  const isExactOut = path[path.length - 1].wrapped.equals(amount.currency.wrapped)
  const result = await client.multicall({
    contracts: [buildV3QuoteCall<SupportedPool>(route)],
    allowFailure: false,
  })

  const [[quote, , , gasUseEstimate]] = result
  const outCurrency = isExactOut ? path[0] : path[path.length - 1]
  return {
    quote: CurrencyAmount.fromRawAmount(outCurrency, quote),
    gasUseEstimate,
  }
}
