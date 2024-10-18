import { Address, zeroAddress } from 'viem'
import { Currency, getCurrencyAddress } from '@pancakeswap/swap-sdk-core'
import { encodeCLPoolParameters } from '@pancakeswap/v4-sdk'

import { BaseRoute, Pool } from '../types'
import { getOutputCurrency, isV4ClPool } from './pool'

export type PathKey = {
  intermediateCurrency: Address
  fee: number
  hooks: Address
  poolManager: Address
  hookData: `0x${string}`
  parameters: `0x${string}`
}

/**
 * Converts a route to a hex encoded path
 * @param route the mixed path to convert to an encoded path
 * @returns the encoded path
 */
export function encodeV4ClRouteToPath(route: BaseRoute, exactOutput: boolean): PathKey[] {
  if (route.pools.some((p) => !isV4ClPool(p))) {
    throw new Error('Invalid v4 cl pool')
  }

  const firstInputCurrency = route.input

  const { path } = route.pools.reduce(
    (
      // eslint-disable-next-line @typescript-eslint/no-shadow
      { inputCurrency, path }: { inputCurrency: Currency; path: PathKey[] },
      pool: Pool,
    ): { inputCurrency: Currency; path: PathKey[] } => {
      const outputCurrency = getOutputCurrency(pool, inputCurrency)
      if (!isV4ClPool(pool)) throw new Error('Invalid v4 cl pool')
      return {
        inputCurrency: outputCurrency,
        path: [
          ...path,
          {
            intermediateCurrency: getCurrencyAddress(outputCurrency),
            fee: pool.fee,
            hooks: pool.hooks ?? zeroAddress,
            poolManager: pool.poolManager,
            hookData: '0x',
            parameters: encodeCLPoolParameters({
              tickSpacing: pool.tickSpacing,
            }),
          },
        ],
      }
    },
    { inputCurrency: firstInputCurrency, path: [] },
  )

  return exactOutput ? path.reverse() : path
}
