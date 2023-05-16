import { Currency } from '@pancakeswap/swap-sdk-core'

import {
  DEFAULT_POOL_SELECTOR_CONFIG,
  V3_DEFAULT_POOL_SELECTOR_CONFIG,
  V3_TOKEN_POOL_SELECTOR_CONFIG,
} from '../constants'
import { PoolSelectorConfig } from '../types'
import { mergePoolSelectorConfig } from './mergePoolSelectorConfig'

export function getV3PoolSelectorConfig(currencyA?: Currency, currencyB?: Currency): PoolSelectorConfig {
  const chainId = currencyA?.chainId
  if (!chainId || !V3_DEFAULT_POOL_SELECTOR_CONFIG[chainId]) {
    return DEFAULT_POOL_SELECTOR_CONFIG
  }

  const additionalConfigA = V3_TOKEN_POOL_SELECTOR_CONFIG[chainId]?.[currencyA?.wrapped.address || '']
  const additionalConfigB = V3_TOKEN_POOL_SELECTOR_CONFIG[chainId]?.[currencyB?.wrapped?.address || '']
  return mergePoolSelectorConfig(
    mergePoolSelectorConfig(V3_DEFAULT_POOL_SELECTOR_CONFIG[chainId], additionalConfigA),
    additionalConfigB,
  )
}
