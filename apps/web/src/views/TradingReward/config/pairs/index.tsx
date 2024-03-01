import { ChainId } from '@pancakeswap/chains'
import { farmsV3 as arbitrumFarm } from '@pancakeswap/farms/constants/arb'
import { farmsV3 as baseFarm } from '@pancakeswap/farms/constants/base'
import { farmsV3 as bscFarm } from '@pancakeswap/farms/constants/bsc'
import { farmsV3 as farm97 } from '@pancakeswap/farms/constants/bscTestnet'
import { farmsV3 as ethFarm } from '@pancakeswap/farms/constants/eth'
import { farmsV3 as farm5 } from '@pancakeswap/farms/constants/goerli'
import { farmsV3 as lineaFarm } from '@pancakeswap/farms/constants/linea'
import { farmsV3 as opBNBFarms } from '@pancakeswap/farms/constants/opBNB'
import { farmsV3 as opBNBTestnetFarms } from '@pancakeswap/farms/constants/opBnbTestnet'
import { farmsV3 as zkEvmFarm } from '@pancakeswap/farms/constants/polygonZkEVM'
import { farmsV3 as zkSyncFarm } from '@pancakeswap/farms/constants/zkSync'
import { ComputedFarmConfigV3, FarmV3SupportedChainId } from '@pancakeswap/farms/src'

// Edge Case Farms
import { tradingRewardBaseV3Pair } from './edgeCasesFarms/baseFarm'
import { tradingRewardBscV3Pair } from './edgeCasesFarms/bscFarm'
import { tradingRewardLineaV3Pair } from './edgeCasesFarms/lineaFarm'
import { tradingRewardZkEvmV3Pair } from './edgeCasesFarms/zkEVMFarm'
import { tradingRewardZkSyncV3Pair } from './edgeCasesFarms/zkSyncFarm'

export const tradingRewardPairConfigChainMap: Record<FarmV3SupportedChainId, ComputedFarmConfigV3[]> = {
  [ChainId.ETHEREUM]: ethFarm,
  [ChainId.GOERLI]: farm5,
  [ChainId.BSC]: [...bscFarm, ...tradingRewardBscV3Pair],
  [ChainId.BSC_TESTNET]: farm97,
  [ChainId.POLYGON_ZKEVM]: [...zkEvmFarm, ...tradingRewardZkEvmV3Pair],
  [ChainId.POLYGON_ZKEVM_TESTNET]: [],
  [ChainId.ZKSYNC]: [...zkSyncFarm, ...tradingRewardZkSyncV3Pair],
  [ChainId.ZKSYNC_TESTNET]: [],
  [ChainId.ARBITRUM_ONE]: arbitrumFarm,
  [ChainId.LINEA]: [...lineaFarm, ...tradingRewardLineaV3Pair],
  [ChainId.BASE]: [...baseFarm, ...tradingRewardBaseV3Pair],
  [ChainId.OPBNB_TESTNET]: opBNBTestnetFarms,
  [ChainId.OPBNB]: opBNBFarms,
}
