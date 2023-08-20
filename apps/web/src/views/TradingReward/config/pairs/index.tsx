import { ChainId } from '@pancakeswap/sdk'
import { ComputedFarmConfigV3, FarmV3SupportedChainId } from '@pancakeswap/farms/src'
import { farmsV3 as farm1 } from '@pancakeswap/farms/constants/1'
import { farmsV3 as farm5 } from '@pancakeswap/farms/constants/5'
import { farmsV3 as farm56 } from '@pancakeswap/farms/constants/56'
import { farmsV3 as farm97 } from '@pancakeswap/farms/constants/97'
import { farmsV3 as farm1101 } from '@pancakeswap/farms/constants/1101'
import { farmsV3 as farm324 } from '@pancakeswap/farms/constants/324'
import { tradingRewardV3Pair as tradingRewardV3Pair56 } from './56'

export const tradingRewardPairConfigChainMap: Record<FarmV3SupportedChainId, ComputedFarmConfigV3[]> = {
  [ChainId.ETHEREUM]: farm1,
  [ChainId.GOERLI]: farm5,
  [ChainId.BSC]: [...farm56, ...tradingRewardV3Pair56],
  [ChainId.BSC_TESTNET]: farm97,
  [ChainId.POLYGON_ZKEVM]: farm1101,
  [ChainId.POLYGON_ZKEVM_TESTNET]: [],
  [ChainId.ZKSYNC]: farm324,
  [ChainId.ZKSYNC_TESTNET]: [],
  [ChainId.ARBITRUM_ONE]: [],
}
