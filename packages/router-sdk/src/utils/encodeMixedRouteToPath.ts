import { pack } from '@ethersproject/solidity'
import { Pair, Currency, Token } from '@pancakeswap/sdk'
import { Pool } from '@pancakeswap/v3-sdk'
import { MixedRouteSDK } from '../entities/mixedRoute/route'
import { V2_FEE_PATH_PLACEHOLDER } from '../constants'

/**
 * Converts a route to a hex encoded path
 * @notice only supports exactIn route encodings
 * @param route the mixed path to convert to an encoded path
 * @returns the exactIn encoded path
 */
export function encodeMixedRouteToPath(route: MixedRouteSDK<Currency, Currency>): string {
  const firstInputToken: Token = route.input.wrapped

  const { path, types } = route.pools.reduce(
    (
      {
        inputToken,
        path: poolPath,
        types: poolTypes,
      }: { inputToken: Token; path: (string | number)[]; types: string[] },
      pool: Pool | Pair,
      index
    ): { inputToken: Token; path: (string | number)[]; types: string[] } => {
      const outputToken: Token = pool.token0.equals(inputToken) ? pool.token1 : pool.token0
      if (index === 0) {
        return {
          inputToken: outputToken,
          types: ['address', 'uint24', 'address'],
          path: [inputToken.address, pool instanceof Pool ? pool.fee : V2_FEE_PATH_PLACEHOLDER, outputToken.address],
        }
      }
      return {
        inputToken: outputToken,
        types: [...poolTypes, 'uint24', 'address'],
        path: [...poolPath, pool instanceof Pool ? pool.fee : V2_FEE_PATH_PLACEHOLDER, outputToken.address],
      }
    },
    { inputToken: firstInputToken, path: [], types: [] }
  )

  return pack(types, path)
}
