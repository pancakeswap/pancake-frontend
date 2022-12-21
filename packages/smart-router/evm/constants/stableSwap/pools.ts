import { ChainId } from '@pancakeswap/sdk'

import { StableSwapPool } from '../../types/pool'
import { pools as ethereumPools } from './1'
import { pools as bscPools } from './56'
import { pools as bscTestnetPools } from './97'

export type StableSwapPoolMap<TChainId extends number> = {
  [chainId in TChainId]: StableSwapPool[]
}

export const poolMap: StableSwapPoolMap<ChainId> = {
  [ChainId.ETHEREUM]: ethereumPools,
  [ChainId.GOERLI]: [],
  [ChainId.BSC]: bscPools,
  [ChainId.BSC_TESTNET]: bscTestnetPools,
}
