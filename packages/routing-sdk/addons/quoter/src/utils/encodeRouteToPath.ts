import { type Hex, encodePacked } from 'viem'
import { Token } from '@pancakeswap/swap-sdk-core'
import type { Pool } from '@pancakeswap/routing-sdk'
import { isV3Pool } from '@pancakeswap/routing-sdk-addon-v3'

import type { QuoteRoute } from '../types'
import { EMPTY_FEE_PATH_PLACEHOLDER } from '../constants'

/**
 * Converts a route to a hex encoded path
 * @param route the mixed path to convert to an encoded path
 * @returns the encoded path
 */
export function encodeRouteToPath(route: QuoteRoute, exactOutput: boolean): Hex {
  const firstInputToken: Token = route.path[0].wrapped

  const { path, types } = route.pools.reduce(
    (
      { inputToken, path: p, types: t }: { inputToken: Token; path: (string | number)[]; types: string[] },
      pool: Pool,
      index,
    ): { inputToken: Token; path: (string | number)[]; types: string[] } => {
      const outputToken = route.path[index + 1].wrapped
      const fee = isV3Pool(pool) ? pool.getPoolData().fee : EMPTY_FEE_PATH_PLACEHOLDER
      if (index === 0) {
        return {
          inputToken: outputToken,
          types: ['address', 'uint24', 'address'],
          path: [inputToken.address, fee, outputToken.address],
        }
      }
      return {
        inputToken: outputToken,
        types: [...t, 'uint24', 'address'],
        path: [...p, fee, outputToken.address],
      }
    },
    { inputToken: firstInputToken, path: [], types: [] },
  )

  return exactOutput ? encodePacked(types.reverse(), path.reverse()) : encodePacked(types, path)
}
