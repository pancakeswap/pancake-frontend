import { Currency } from '@pancakeswap/sdk'

import { Pool } from '../types'
import { involvesCurrency, getOutputCurrency } from './pool'

/**
 * Simple utility function to get the output of an array of Pools or Pairs
 * @param pools
 * @param firstInputToken
 * @returns the output token of the last pool in the array
 */
export const getOutputOfPools = (pools: Pool[], firstInputToken: Currency): Currency => {
  const { inputToken: outputToken } = pools.reduce(
    ({ inputToken }, pool: Pool): { inputToken: Currency } => {
      if (!involvesCurrency(pool, inputToken)) throw new Error('PATH')
      const output = getOutputCurrency(pool, inputToken)
      return {
        inputToken: output,
      }
    },
    { inputToken: firstInputToken },
  )
  return outputToken
}
