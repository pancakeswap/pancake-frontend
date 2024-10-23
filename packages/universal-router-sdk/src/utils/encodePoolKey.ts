import { isV4BinPool, V4BinPool, V4ClPool } from '@pancakeswap/smart-router'
import { EncodedPoolKey, encodePoolParameters } from '@pancakeswap/v4-sdk'
import { zeroAddress } from 'viem'
import { currencyAddressV4 } from './currencyAddressV4'

export const encodePoolKey = (pool: V4BinPool | V4ClPool): EncodedPoolKey => {
  const params = isV4BinPool(pool)
    ? zeroAddress
    : encodePoolParameters({
        tickSpacing: pool.tickSpacing,
      })

  return {
    currency0: currencyAddressV4(pool.currency0),
    currency1: currencyAddressV4(pool.currency1),
    hooks: pool.hooks || zeroAddress,
    poolManager: pool.poolManager,
    fee: pool.fee,
    parameters: params,
  }
}
