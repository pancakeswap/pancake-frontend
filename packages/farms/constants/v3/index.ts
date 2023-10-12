import { ChainId } from '@pancakeswap/chains'
import { ComputedFarmConfigV3 } from '../../src/types'
import { FarmV3SupportedChainId } from '../../src'
import { farmsV3 as ethFarms } from '../eth'
import { farmsV3 as goerliFarms } from '../goerli'
import { farmsV3 as bscFarms } from '../bsc'
import { farmsV3 as bscTestnetFarms } from '../bscTestnet'
import { farmsV3 as zkSyncTestnetFarms } from '../zkSyncTestnet'
import { farmsV3 as polygonZkEVMFarms } from '../polygonZkEVM'
import { farmsV3 as zkSyncFarms } from '../zkSync'
import { farmsV3 as polygonZkEVMTestnetFarms } from '../polygonZkEVMTestnet'
import { farmsV3 as arbFarms } from '../arb'
import { farmsV3 as lineaFarms } from '../linea'
import { farmsV3 as baseFarms } from '../base'

export const farmsV3ConfigChainMap: Record<FarmV3SupportedChainId, ComputedFarmConfigV3[]> = {
  [ChainId.ETHEREUM]: ethFarms,
  [ChainId.GOERLI]: goerliFarms,
  [ChainId.BSC]: bscFarms,
  [ChainId.BSC_TESTNET]: bscTestnetFarms,
  [ChainId.ZKSYNC_TESTNET]: zkSyncTestnetFarms,
  [ChainId.POLYGON_ZKEVM]: polygonZkEVMFarms,
  [ChainId.POLYGON_ZKEVM_TESTNET]: polygonZkEVMTestnetFarms,
  [ChainId.ZKSYNC]: zkSyncFarms,
  [ChainId.ARBITRUM_ONE]: arbFarms,
  [ChainId.LINEA]: lineaFarms,
  [ChainId.BASE]: baseFarms,
}
