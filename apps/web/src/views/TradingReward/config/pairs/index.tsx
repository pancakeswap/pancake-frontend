import { ChainId } from '@pancakeswap/chains'
import { ComputedFarmConfigV3, FarmV3SupportedChainId } from '@pancakeswap/farms/src'

// Edge Case Farms
import { legacyV3ArbFarmConfig } from '@pancakeswap/farms/src/farms/arb'
import { legacyV3BaseFarmConfig } from '@pancakeswap/farms/src/farms/base'
import { legacyV3BscFarmConfig } from '@pancakeswap/farms/src/farms/bsc'
import { legacyV3BscTestnetFarmConfig } from '@pancakeswap/farms/src/farms/bscTestnet'
import { legacyV3EthereumFarmConfig } from '@pancakeswap/farms/src/farms/eth'
import { legacyV3LineaFarmConfig } from '@pancakeswap/farms/src/farms/linea'
import { legacyV3OpBNBFarmConfig } from '@pancakeswap/farms/src/farms/opBNB'
import { legacyV3OpBNBTestnetFarmConfig } from '@pancakeswap/farms/src/farms/opBnbTestnet'
import { legacyV3PolygonZkEVMFarmConfig } from '@pancakeswap/farms/src/farms/polygonZkEVM'
import { legacyV3ZkSyncFarmConfig } from '@pancakeswap/farms/src/farms/zkSync'
import { tradingRewardBaseV3Pair } from './edgeCasesFarms/baseFarm'
import { tradingRewardBscV3Pair } from './edgeCasesFarms/bscFarm'
import { tradingRewardLineaV3Pair } from './edgeCasesFarms/lineaFarm'
import { tradingRewardZkEvmV3Pair } from './edgeCasesFarms/zkEVMFarm'
import { tradingRewardZkSyncV3Pair } from './edgeCasesFarms/zkSyncFarm'

export const tradingRewardPairConfigChainMap: Record<FarmV3SupportedChainId, ComputedFarmConfigV3[]> = {
  [ChainId.ETHEREUM]: legacyV3EthereumFarmConfig,
  [ChainId.BSC]: [...legacyV3BscFarmConfig, ...tradingRewardBscV3Pair],
  [ChainId.BSC_TESTNET]: legacyV3BscTestnetFarmConfig,
  [ChainId.POLYGON_ZKEVM]: [...legacyV3PolygonZkEVMFarmConfig, ...tradingRewardZkEvmV3Pair],
  [ChainId.POLYGON_ZKEVM_TESTNET]: [],
  [ChainId.ZKSYNC]: [...legacyV3ZkSyncFarmConfig, ...tradingRewardZkSyncV3Pair],
  [ChainId.ZKSYNC_TESTNET]: [],
  [ChainId.ARBITRUM_ONE]: legacyV3ArbFarmConfig,
  [ChainId.LINEA]: [...legacyV3LineaFarmConfig, ...tradingRewardLineaV3Pair],
  [ChainId.BASE]: [...legacyV3BaseFarmConfig, ...tradingRewardBaseV3Pair],
  [ChainId.OPBNB_TESTNET]: legacyV3OpBNBTestnetFarmConfig,
  [ChainId.OPBNB]: legacyV3OpBNBFarmConfig,
}
