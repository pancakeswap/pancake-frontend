import { zeroAddress } from 'viem'
import type { EncodedPoolKey, PoolKey } from '../types'
import { encodePoolParameters } from './encodePoolParameters'

/**
 * encode `PoolKey` to `EncodedPoolKey`
 *
 * @param poolKey PoolKey
 * @returns EncodedPoolKey
 */
export const encodePoolKey = (poolKey: PoolKey): EncodedPoolKey => {
  return {
    ...poolKey,
    hooks: poolKey.hooks ?? zeroAddress,
    parameters: encodePoolParameters(poolKey.parameters),
  }
}
