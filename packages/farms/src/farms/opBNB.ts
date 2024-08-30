import { ChainId } from '@pancakeswap/chains'
import { opBnbTokens } from '@pancakeswap/tokens'
import { FeeAmount, Pool } from '@pancakeswap/v3-sdk'
import { defineFarmV3ConfigsFromUniversalFarm } from '../defineFarmV3Configs'
import { Protocol, SerializedFarmConfig, UniversalFarmConfig, UniversalFarmConfigV3 } from '../types'

const pinnedFarmConfig: UniversalFarmConfig[] = []

export const opBNBFarmConfig: UniversalFarmConfig[] = [
  ...pinnedFarmConfig,
  {
    pid: 4,
    chainId: ChainId.OPBNB,
    protocol: Protocol.V3,
    token0: opBnbTokens.usdt,
    token1: opBnbTokens.xcad,
    feeAmount: FeeAmount.HIGH,
    lpAddress: Pool.getAddress(opBnbTokens.usdt, opBnbTokens.xcad, FeeAmount.HIGH),
  },
  {
    pid: 3,
    chainId: ChainId.OPBNB,
    protocol: Protocol.V3,
    token0: opBnbTokens.wbnb,
    token1: opBnbTokens.eth,
    feeAmount: FeeAmount.MEDIUM,
    lpAddress: Pool.getAddress(opBnbTokens.wbnb, opBnbTokens.eth, FeeAmount.MEDIUM),
  },
  {
    pid: 2,
    chainId: ChainId.OPBNB,
    protocol: Protocol.V3,
    token0: opBnbTokens.fdusd,
    token1: opBnbTokens.usdt,
    feeAmount: FeeAmount.LOWEST,
    lpAddress: Pool.getAddress(opBnbTokens.fdusd, opBnbTokens.usdt, FeeAmount.LOWEST),
  },
  {
    pid: 1,
    chainId: ChainId.OPBNB,
    protocol: Protocol.V3,
    token0: opBnbTokens.wbnb,
    token1: opBnbTokens.usdt,
    feeAmount: FeeAmount.LOW,
    lpAddress: Pool.getAddress(opBnbTokens.wbnb, opBnbTokens.usdt, FeeAmount.LOW),
  },
]

export default opBNBFarmConfig

/** @deprecated */
export const legacyV3OpBNBFarmConfig = defineFarmV3ConfigsFromUniversalFarm(
  opBNBFarmConfig.filter((farm): farm is UniversalFarmConfigV3 => farm.protocol === Protocol.V3),
)

/** @deprecated */
export const legacyFarmConfig: SerializedFarmConfig[] = []
