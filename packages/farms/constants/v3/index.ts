import { ChainId } from '@pancakeswap/chains'
import { Address } from 'viem'
import { FarmV3SupportedChainId } from '../../src'
import { legacyV3ArbFarmConfig } from '../../src/farms/arb'
import { legacyV3BaseFarmConfig } from '../../src/farms/base'
import { legacyV3BscFarmConfig } from '../../src/farms/bsc'
import { legacyV3BscTestnetFarmConfig } from '../../src/farms/bscTestnet'
import { legacyV3EthereumFarmConfig } from '../../src/farms/eth'
import { legacyV3LineaFarmConfig } from '../../src/farms/linea'
import { legacyV3OpBNBFarmConfig } from '../../src/farms/opBNB'
import { legacyV3OpBNBTestnetFarmConfig } from '../../src/farms/opBnbTestnet'
import { legacyV3PolygonZkEVMFarmConfig } from '../../src/farms/polygonZkEVM'
import { legacyV3PolygonZkEVMTestnetFarmConfig } from '../../src/farms/polygonZkEVMTestnet'
import { legacyV3ZkSyncFarmConfig } from '../../src/farms/zkSync'
import { legacyV3ZkSyncTestnetFarmConfig } from '../../src/farms/zkSyncTestnet'
import { ComputedFarmConfigV3 } from '../../src/types'

/** @deprecated */
export const legacyFarmsV3ConfigChainMap: Record<FarmV3SupportedChainId, ComputedFarmConfigV3[]> = {
  [ChainId.ETHEREUM]: legacyV3EthereumFarmConfig,
  [ChainId.BSC]: legacyV3BscFarmConfig,
  [ChainId.BSC_TESTNET]: legacyV3BscTestnetFarmConfig,
  [ChainId.ZKSYNC_TESTNET]: legacyV3ZkSyncTestnetFarmConfig,
  [ChainId.POLYGON_ZKEVM]: legacyV3PolygonZkEVMFarmConfig,
  [ChainId.POLYGON_ZKEVM_TESTNET]: legacyV3PolygonZkEVMTestnetFarmConfig,
  [ChainId.ZKSYNC]: legacyV3ZkSyncFarmConfig,
  [ChainId.ARBITRUM_ONE]: legacyV3ArbFarmConfig,
  [ChainId.LINEA]: legacyV3LineaFarmConfig,
  [ChainId.BASE]: legacyV3BaseFarmConfig,
  [ChainId.OPBNB_TESTNET]: legacyV3OpBNBTestnetFarmConfig,
  [ChainId.OPBNB]: legacyV3OpBNBFarmConfig,
}

export type Addresses = {
  [chainId in ChainId]?: Address
}

export const bCakeFarmBoosterV3Address: Addresses = {
  [ChainId.BSC]: '0x695170faE243147b3bEB4C43AA8DE5DcD9202752',
  [ChainId.BSC_TESTNET]: '0x56666300A1E25624489b661f3C6c456c159a109a',
}
export const bCakeFarmBoosterV3VeCakeAddress: Addresses = {
  [ChainId.BSC]: '0x625F45234D6335859a8b940960067E89476300c6',
  [ChainId.BSC_TESTNET]: '0x1F32591CC45f00BaE3A742Bf2bCAdAe59DbAd228',
  [ChainId.ARBITRUM_ONE]: '0xc4EfD50205Ccd15c192F342B3837d644c8fff99a',
  [ChainId.ETHEREUM]: '0xE604940C06DF1B6A9851f8E8D8d22468CB932E38',
  [ChainId.ZKSYNC]: '0xBF5412F6217Fd57caf46e51f7929ea6f74739D21',
}

export const bCakeFarmWrapperBoosterVeCakeAddress: Addresses = {
  [ChainId.BSC]: '0x5dbC7e443cCaD0bFB15a081F1A5C6BA0caB5b1E6',
  [ChainId.ARBITRUM_ONE]: '0x21Eb14cf06270Ef944A1480bEf9163fe4Cf7DB14',
  [ChainId.ETHEREUM]: '0xB509DBeE68B273767Cd8D45c1Ce95453391741f6',
  [ChainId.ZKSYNC]: '0x5497577d6d37B825C74B0d41F580a009b79362eB',
}
