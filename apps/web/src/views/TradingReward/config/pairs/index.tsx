import { ChainId } from '@pancakeswap/chains'
import { ComputedFarmConfigV3, FarmV3SupportedChainId } from '@pancakeswap/farms/src'

// Edge Case Farms
import { tradingRewardBaseV3Pair } from './edgeCasesFarms/baseFarm'
import { tradingRewardBscV3Pair } from './edgeCasesFarms/bscFarm'
import { tradingRewardLineaV3Pair } from './edgeCasesFarms/lineaFarm'
import { tradingRewardZkEvmV3Pair } from './edgeCasesFarms/zkEVMFarm'
import { tradingRewardZkSyncV3Pair } from './edgeCasesFarms/zkSyncFarm'

export const tradingRewardPairConfigChainMap: Record<FarmV3SupportedChainId, ComputedFarmConfigV3[]> = {
  [ChainId.ETHEREUM]: [],
  [ChainId.BSC]: [...tradingRewardBscV3Pair],
  [ChainId.BSC_TESTNET]: [],
  [ChainId.POLYGON_ZKEVM]: [...tradingRewardZkEvmV3Pair],
  [ChainId.POLYGON_ZKEVM_TESTNET]: [],
  [ChainId.ZKSYNC]: [...tradingRewardZkSyncV3Pair],
  [ChainId.ZKSYNC_TESTNET]: [],
  [ChainId.ARBITRUM_ONE]: [],
  [ChainId.LINEA]: [...tradingRewardLineaV3Pair],
  [ChainId.BASE]: [...tradingRewardBaseV3Pair],
  [ChainId.OPBNB_TESTNET]: [],
  [ChainId.OPBNB]: [],
}
