import { ChainId } from '@pancakeswap/sdk'
import { ComputedFarmConfigV3, FarmV3SupportedChainId } from '@pancakeswap/farms/src'
import { farmsV3 as ethFarm } from '@pancakeswap/farms/constants/1'
import { farmsV3 as farm5 } from '@pancakeswap/farms/constants/5'
import { farmsV3 as bscFarm } from '@pancakeswap/farms/constants/56'
import { farmsV3 as farm97 } from '@pancakeswap/farms/constants/97'
import { farmsV3 as zkEvmFarm } from '@pancakeswap/farms/constants/1101'
import { farmsV3 as zkSyncFarm } from '@pancakeswap/farms/constants/324'
import { farmsV3 as lineaFarm } from '@pancakeswap/farms/constants/59144'
import { farmsV3 as arbitrumFarm } from '@pancakeswap/farms/constants/42161'
import { farmsV3 as baseFarm } from '@pancakeswap/farms/constants/8453'
import { tradingRewardV3Pair as tradingRewardV3Pair56 } from './56'

export const tradingRewardPairConfigChainMap: Record<FarmV3SupportedChainId, ComputedFarmConfigV3[]> = {
  [ChainId.ETHEREUM]: ethFarm,
  [ChainId.GOERLI]: farm5,
  [ChainId.BSC]: [...bscFarm, ...tradingRewardV3Pair56],
  [ChainId.BSC_TESTNET]: farm97,
  [ChainId.POLYGON_ZKEVM]: zkEvmFarm,
  [ChainId.POLYGON_ZKEVM_TESTNET]: [],
  [ChainId.ZKSYNC]: zkSyncFarm,
  [ChainId.ZKSYNC_TESTNET]: [],
  [ChainId.ARBITRUM_ONE]: arbitrumFarm,
  [ChainId.LINEA]: lineaFarm,
  [ChainId.BASE]: baseFarm,
}
