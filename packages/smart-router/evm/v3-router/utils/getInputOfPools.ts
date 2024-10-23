import { Currency } from '@pancakeswap/sdk'

import { Pool } from '../types'
import { isV2Pool, isV3Pool, isV4BinPool, isV4ClPool } from './pool'

/**
 * Simple utility function to get the input of an array of Pools or Pairs
 * @param pools
 * @param firstInputToken
 * @returns the input token of the first pool in the array
 */
export const getInputOfPools = (pools: Pool[]): Currency => {
  const first = pools[0]
  if (isV2Pool(first)) {
    return first.reserve0.currency
  }
  if (isV3Pool(first)) {
    return first.token0
  }
  if (isV4BinPool(first) || isV4ClPool(first)) {
    return first.currency0
  }
  throw new Error('Unknown pool type')
}
