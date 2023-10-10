import { ChainId } from '@pancakeswap/chains'
import { ComputedFarmConfigV3, FarmV3SupportedChainId } from '@pancakeswap/farms/src'
import { farmsV3 as ethFarm } from '@pancakeswap/farms/constants/eth'
import { farmsV3 as farm5 } from '@pancakeswap/farms/constants/goerli'
import { farmsV3 as bscFarm } from '@pancakeswap/farms/constants/bsc'
import { farmsV3 as farm97 } from '@pancakeswap/farms/constants/bscTestnet'
import { farmsV3 as zkEvmFarm } from '@pancakeswap/farms/constants/polygonZkEVM'
import { farmsV3 as zkSyncFarm } from '@pancakeswap/farms/constants/zkSync'
import { farmsV3 as lineaFarm } from '@pancakeswap/farms/constants/linea'
import { farmsV3 as arbitrumFarm } from '@pancakeswap/farms/constants/arb'
import { farmsV3 as baseFarm } from '@pancakeswap/farms/constants/base'
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
