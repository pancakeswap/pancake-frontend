import { Currency, CurrencyAmount } from '@pancakeswap/sdk'

import { Pool } from '../v3-router/types'
import { isStablePool, isV2Pool, isV3Pool } from '../v3-router/utils'

export function getCurrencyPairs(p: Pool): [Currency, Currency][] {
  if (isV3Pool(p)) {
    return [[p.token0, p.token1]]
  }
  if (isV2Pool(p)) {
    return [[p.reserve0.currency, p.reserve1.currency]]
  }
  if (isStablePool(p)) {
    const currencies = p.balances.map((b) => b.currency)
    const pairs: [Currency, Currency][] = []
    for (let i = 0; i < currencies.length; i++) {
      for (let j = i + 1; j < currencies.length; j++) {
        pairs.push([currencies[i], currencies[j]])
      }
    }
    return pairs
  }
  throw new Error('[Get currency pairs]: Unknown pool type')
}

export function getReserve(p: Pool, currency: Currency): CurrencyAmount<Currency> | undefined {
  if (isV3Pool(p)) {
    return p.token0.equals(currency.wrapped) ? p.reserve0 : p.reserve1
  }
  if (isV2Pool(p)) {
    return p.reserve0.currency.wrapped.equals(currency.wrapped) ? p.reserve0 : p.reserve1
  }
  if (isStablePool(p)) {
    return p.balances.find((b) => b.currency.wrapped.equals(currency.wrapped))
  }
  throw new Error('[Get reserve]: Unknown pool type')
}
