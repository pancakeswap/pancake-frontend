import { Price, Currency } from '@pancakeswap/swap-sdk-core'
import { getSwapOutput, getQuoteExactIn, getQuoteExactOut } from '@pancakeswap/stable-swap-sdk'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import invariant from 'tiny-invariant'

import type { StablePool, StablePoolData } from './types'
import { BASE_SWAP_COST_STABLE_SWAP, COST_PER_EXTRA_HOP_STABLE_SWAP, STABLE_POOL_TYPE } from './constants'

export function createStablePool(params: StablePoolData): StablePool {
  let p = { ...params, type: STABLE_POOL_TYPE }

  const pool: StablePool = {
    type: STABLE_POOL_TYPE,
    getReserve: (c) => {
      const reserve = p.balances.find((b) => b.currency.wrapped.equals(c.wrapped))
      invariant(reserve !== undefined, 'NO_RESERVE_FOUND')
      return reserve
    },
    getCurrentPrice: (base, quote) => {
      const { amplifier, balances, fee } = p
      const baseIn = tryParseAmount('1', base)
      if (!baseIn) {
        throw new Error(`Cannot parse amount for ${base.symbol}`)
      }
      const quoteOut = getSwapOutput({
        amplifier,
        balances,
        fee,
        outputCurrency: quote,
        amount: baseIn,
      })

      return new Price({
        baseAmount: baseIn,
        quoteAmount: quoteOut,
      })
    },
    getTradingPairs: () => {
      const pairs: [Currency, Currency][] = []
      const size = p.balances.length
      for (let i = 0; i < size - 1; i += 1) {
        for (let j = i + 1; j < size; j += 1) {
          pairs.push([p.balances[i].currency, p.balances[j].currency])
        }
      }
      return pairs
    },
    getId: () => p.address,
    update: (poolData) => {
      p = { ...p, ...poolData }
    },
    log: () => `Stable Swap ${p.balances.map((b) => b.currency.symbol).join(' - ')} (${p.address}`,

    getPoolData: () => p,

    getQuote: ({ amount, isExactIn, quoteCurrency }) => {
      const getQuote = isExactIn ? getQuoteExactIn : getQuoteExactOut
      const { amplifier, balances, fee } = p
      const [quote, { balances: newBalances }] = getQuote({
        amount,
        balances,
        amplifier,
        outputCurrency: quoteCurrency,
        fee,
      })
      const newPoolData = { ...p, balances: newBalances }
      return {
        poolAfter: createStablePool(newPoolData),
        quote,
        pool,
      }
    },

    estimateGasCostForQuote: () => {
      return BASE_SWAP_COST_STABLE_SWAP + COST_PER_EXTRA_HOP_STABLE_SWAP
    },
  }

  return pool
}
