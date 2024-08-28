import { UniversalFarmConfig } from '../types'

import { arbFarmConfig } from './arb'
import { baseFarmConfig } from './base'
import { bscFarmConfig } from './bsc'
import { ethereumFarmConfig } from './eth'
import { lineaFarmConfig } from './linea'
import { opBNBFarmConfig } from './opBNB'
import { polygonZkEVMFarmConfig } from './polygonZkEVM'
import { zkSyncFarmConfig } from './zkSync'

import { bscTestnetFarmConfig } from './bscTestnet'
import { polygonZkEVMTestnetFarmConfig } from './polygonZkEVMTestnet'
import { zkSyncTestnetFarmConfig } from './zkSyncTestnet'

export { UNIVERSAL_BCAKEWRAPPER_FARMS } from './bCakeWrapper'

export const UNIVERSAL_FARMS: UniversalFarmConfig[] = [
  ...bscFarmConfig,
  ...ethereumFarmConfig,
  ...polygonZkEVMFarmConfig,
  ...zkSyncFarmConfig,
  ...arbFarmConfig,
  ...lineaFarmConfig,
  ...baseFarmConfig,
  ...opBNBFarmConfig,
]

export const UNIVERSAL_FARMS_WITH_TESTNET: UniversalFarmConfig[] = [
  ...UNIVERSAL_FARMS,
  ...bscTestnetFarmConfig,
  ...polygonZkEVMTestnetFarmConfig,
  ...zkSyncTestnetFarmConfig,
]
