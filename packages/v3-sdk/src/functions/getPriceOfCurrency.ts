import { Currency } from '@pancakeswap/swap-sdk-core'
import invariant from 'tiny-invariant'
import { getCurrency0Price, getCurrency1Price } from './getCurrencyPrice'
import { PoolState } from './getPool'

export const getPriceOfCurrency = (
  pool: Pick<PoolState, 'currency0' | 'currency1' | 'sqrtRatioX96'>,
  currency: Currency
) => {
  if (currency.isNative) {
    invariant(pool.currency0.isNative, 'CURRENCY')
    return getCurrency0Price([pool.currency0, pool.currency1], pool.sqrtRatioX96)
  }

  invariant(pool.currency0.equals(currency) || pool.currency1.equals(currency), 'CURRENCY')
  return pool.currency0.equals(currency)
    ? getCurrency0Price([pool.currency0, pool.currency1], pool.sqrtRatioX96)
    : getCurrency1Price([pool.currency0, pool.currency1], pool.sqrtRatioX96)
}

export const getPriceOfCurrency0 = (pool: Pick<PoolState, 'currency0' | 'currency1' | 'sqrtRatioX96'>) =>
  getCurrency0Price([pool.currency0, pool.currency1], pool.sqrtRatioX96)

export const getPriceOfCurrency1 = (pool: Pick<PoolState, 'currency0' | 'currency1' | 'sqrtRatioX96'>) =>
  getCurrency1Price([pool.currency0, pool.currency1], pool.sqrtRatioX96)
