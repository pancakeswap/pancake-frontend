import { ChainId } from '@pancakeswap/chains'

import { arbBoostedPools } from './42161'

export const POOLS_CONFIG_BY_CHAIN = {
  [ChainId.ARBITRUM_ONE]: arbBoostedPools,
}
