import { Currency } from '@pancakeswap/swap-sdk-core'
import { PoolState } from './getPool'

export const hasInvolvedCurrency = (pool: Pick<PoolState, 'currency0' | 'currency1'>, currency: Currency) => {
  if (currency.isNative) return pool.currency0.isNative && pool.currency1.chainId === currency.chainId
  return pool.currency0.equals(currency) || pool.currency1.equals(currency)
}
