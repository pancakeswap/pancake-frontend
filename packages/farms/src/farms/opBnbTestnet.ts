import { ChainId } from '@pancakeswap/chains'
import { opBnbTestnetTokens } from '@pancakeswap/tokens'
import { FeeAmount, Pool } from '@pancakeswap/v3-sdk'
import { defineFarmV3ConfigsFromUniversalFarm } from '../defineFarmV3Configs'
import { Protocol, SerializedFarmConfig, UniversalFarmConfig, UniversalFarmConfigV3 } from '../types'

const pinnedFarmConfig: UniversalFarmConfig[] = []

export const opBNBTestnetFarmConfig: UniversalFarmConfig[] = [
  ...pinnedFarmConfig,
  {
    pid: 1,
    chainId: ChainId.OPBNB_TESTNET,
    protocol: Protocol.V3,
    token0: opBnbTestnetTokens.mockA,
    token1: opBnbTestnetTokens.wbnb,
    feeAmount: FeeAmount.LOW,
    lpAddress: Pool.getAddress(opBnbTestnetTokens.mockA, opBnbTestnetTokens.wbnb, FeeAmount.LOW),
  },

  {
    pid: 2,
    chainId: ChainId.OPBNB_TESTNET,
    protocol: Protocol.V3,
    token0: opBnbTestnetTokens.mockB,
    token1: opBnbTestnetTokens.wbnb,
    feeAmount: FeeAmount.MEDIUM,
    lpAddress: Pool.getAddress(opBnbTestnetTokens.mockB, opBnbTestnetTokens.wbnb, FeeAmount.MEDIUM),
  },
  {
    pid: 3,
    chainId: ChainId.OPBNB_TESTNET,
    protocol: Protocol.V3,
    token0: opBnbTestnetTokens.mockB,
    token1: opBnbTestnetTokens.mockC,
    feeAmount: FeeAmount.HIGH,
    lpAddress: Pool.getAddress(opBnbTestnetTokens.mockB, opBnbTestnetTokens.mockC, FeeAmount.HIGH),
  },
]

export default opBNBTestnetFarmConfig

/** @deprecated */
export const legacyV3OpBNBTestnetFarmConfig = defineFarmV3ConfigsFromUniversalFarm(
  opBNBTestnetFarmConfig.filter((farm): farm is UniversalFarmConfigV3 => farm.protocol === Protocol.V3),
)

/** @deprecated */
export const legacyFarmConfig: SerializedFarmConfig[] = []
