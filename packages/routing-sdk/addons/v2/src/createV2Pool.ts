import { CurrencyAmount, Price } from '@pancakeswap/swap-sdk-core'
import { Pair } from '@pancakeswap/v2-sdk'

import type { V2Pool, V2PoolData } from './types'
import { BASE_SWAP_COST_V2, COST_PER_EXTRA_HOP_V2, V2_POOL_TYPE } from './constants'

export function createV2Pool(params: V2PoolData): V2Pool {
  let p = { ...params, type: V2_POOL_TYPE }
  const getPoolId = (poolData: V2PoolData) => {
    return Pair.getAddress(poolData.reserve0.currency.wrapped, poolData.reserve1.currency.wrapped)
  }
  let address = getPoolId(p)

  const pool: V2Pool = {
    type: V2_POOL_TYPE,
    getReserve: (c) => (p.reserve0.currency.wrapped.equals(c.wrapped) ? p.reserve0 : p.reserve1),
    getCurrentPrice: (base) => {
      const pair = new Pair(p.reserve0.wrapped, p.reserve1.wrapped)
      const price = pair.priceOf(base.wrapped)
      const [baseCurrency, quoteCurrency] = price.baseCurrency.wrapped.equals(p.reserve0.currency.wrapped)
        ? [p.reserve0.currency, p.reserve1.currency]
        : [p.reserve1.currency, p.reserve0.currency]
      return new Price(baseCurrency, quoteCurrency, price.denominator, price.numerator)
    },
    getTradingPairs: () => [[p.reserve0.currency, p.reserve1.currency]],
    getId: () => address,
    update: (poolData) => {
      p = { ...p, ...poolData }
      address = getPoolId(p)
    },
    log: () =>
      `V3 ${p.reserve0.currency.symbol} - ${p.reserve1.currency.symbol} (${address} - price ${pool
        .getCurrentPrice(p.reserve0.currency, p.reserve1.currency)
        .toSignificant(6)} ${p.reserve1.currency.symbol}/${p.reserve0.currency.symbol}`,

    getPoolData: () => p,

    getQuote: ({ amount, isExactIn }) => {
      const pair = new Pair(p.reserve0.wrapped, p.reserve1.wrapped)
      const quoteCurrency = amount.currency.wrapped.equals(p.reserve0.currency.wrapped)
        ? p.reserve1.currency
        : p.reserve0.currency
      const [quoteAmount, pairAfter] = isExactIn
        ? pair.getOutputAmount(amount.wrapped)
        : pair.getInputAmount(amount.wrapped)
      const quote = CurrencyAmount.fromRawAmount(quoteCurrency, quoteAmount.quotient)
      const newPool = {
        ...p,
        reserve0: CurrencyAmount.fromRawAmount(p.reserve0.currency, pairAfter.reserve0.quotient),
        reserve1: CurrencyAmount.fromRawAmount(p.reserve1.currency, pairAfter.reserve1.quotient),
      }
      return {
        quote,
        poolAfter: createV2Pool(newPool),
        pool,
      }
    },

    estimateGasCostForQuote: () => {
      return BASE_SWAP_COST_V2 + COST_PER_EXTRA_HOP_V2
    },
  }

  return pool
}
