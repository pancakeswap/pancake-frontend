import { ChainId } from '@pancakeswap/chains'
import { zkSyncTestnetTokens } from '@pancakeswap/tokens'
import { FeeAmount, Pool } from '@pancakeswap/v3-sdk'
import { defineFarmV3ConfigsFromUniversalFarm } from '../defineFarmV3Configs'
import { Protocol, SerializedFarmConfig, UniversalFarmConfig, UniversalFarmConfigV3 } from '../types'

const pinnedFarmConfig: UniversalFarmConfig[] = []

export const zkSyncTestnetFarmConfig: UniversalFarmConfig[] = [
  ...pinnedFarmConfig,
  {
    pid: 1,
    chainId: ChainId.ZKSYNC_TESTNET,
    protocol: Protocol.V3,
    token0: zkSyncTestnetTokens.weth,
    token1: zkSyncTestnetTokens.mock,
    feeAmount: FeeAmount.LOW,
    lpAddress: Pool.getAddress(zkSyncTestnetTokens.weth, zkSyncTestnetTokens.mock, FeeAmount.LOW),
  },
  {
    pid: 2,
    chainId: ChainId.ZKSYNC_TESTNET,
    protocol: Protocol.V3,
    token0: zkSyncTestnetTokens.weth,
    token1: zkSyncTestnetTokens.mockC,
    feeAmount: FeeAmount.MEDIUM,
    lpAddress: Pool.getAddress(zkSyncTestnetTokens.weth, zkSyncTestnetTokens.mockC, FeeAmount.MEDIUM),
  },
  {
    pid: 3,
    chainId: ChainId.ZKSYNC_TESTNET,
    protocol: Protocol.V3,
    token0: zkSyncTestnetTokens.mockD,
    token1: zkSyncTestnetTokens.mockC,
    feeAmount: FeeAmount.HIGH,
    lpAddress: Pool.getAddress(zkSyncTestnetTokens.mockD, zkSyncTestnetTokens.mockC, FeeAmount.HIGH),
  },
]

export default zkSyncTestnetFarmConfig

/** @deprecated */
export const legacyV3ZkSyncTestnetFarmConfig = defineFarmV3ConfigsFromUniversalFarm(
  zkSyncTestnetFarmConfig.filter((farm): farm is UniversalFarmConfigV3 => farm.protocol === Protocol.V3),
)

/** @deprecated */
export const legacyFarmConfig: SerializedFarmConfig[] = []
