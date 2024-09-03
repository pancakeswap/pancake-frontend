import { ChainId } from '@pancakeswap/chains'
import { getStableSwapPools } from '@pancakeswap/stable-swap-sdk'
import { isAddressEqual } from 'viem'
import {
  ComputedFarmConfigV3,
  FarmV3Data,
  SerializedClassicFarmConfig,
  SerializedFarmConfig,
  SerializedStableFarmConfig,
  UniversalFarmConfig,
  UniversalFarmConfigStableSwap,
  UniversalFarmConfigV2,
  UniversalFarmConfigV3,
} from './types'

export function isActiveV3Farm(farm: FarmV3Data, poolLength: number) {
  return farm.pid !== 0 && farm.multiplier !== '0X' && poolLength && poolLength >= farm.pid
}

type LegacyFarmConfig = Omit<SerializedFarmConfig, 'pid'> & { chainId: ChainId; version: 2 | 3 } & { pid?: number }
type LegacyStableFarmConfig = Omit<SerializedStableFarmConfig, 'pid'> & { chainId: ChainId; version: 2 | 3 } & {
  pid?: number
}
type LegacyClassicFarmConfig = Omit<SerializedClassicFarmConfig, 'pid'> & { chainId: ChainId; version: 2 | 3 } & {
  pid?: number
}
type LegacyV3FarmConfig = ComputedFarmConfigV3 & { chainId: ChainId; version: 2 | 3 }
export function formatUniversalFarmToSerializedFarm(farms: UniversalFarmConfig[]): Array<LegacyFarmConfig> {
  return farms
    .map((farm) => {
      switch (farm.protocol) {
        case 'stable':
          return formatStableUniversalFarmToSerializedFarm(farm as UniversalFarmConfigStableSwap)
        case 'v2':
          return formatV2UniversalFarmToSerializedFarm(farm as UniversalFarmConfigV2)
        case 'v3':
          return formatV3UniversalFarmToSerializedFarm(farm as UniversalFarmConfigV3)
        default:
          return undefined
      }
    })
    .filter((farm): farm is LegacyFarmConfig => farm !== undefined)
}

const formatStableUniversalFarmToSerializedFarm = (
  farm: UniversalFarmConfigStableSwap,
): LegacyStableFarmConfig | undefined => {
  const { chainId, lpAddress, pid, token0, token1, stableSwapAddress, bCakeWrapperAddress } = farm
  const stablePair = getStableSwapPools(chainId).find((pair) => {
    return isAddressEqual(pair.stableSwapAddress, stableSwapAddress)
  })

  if (!stablePair) {
    console.warn(`Could not find stable pair for farm with stableSwapAddress ${stableSwapAddress}`)
    return undefined
  }

  return {
    pid,
    lpAddress,
    lpSymbol: `${token0.symbol}-${token1.symbol} LP`,
    token: token0,
    quoteToken: token1,
    stableSwapAddress,
    stableLpFee: stablePair.stableLpFee,
    stableLpFeeRateOfTotalFee: stablePair.stableLpFeeRateOfTotalFee,
    infoStableSwapAddress: stablePair.infoStableSwapAddress,
    bCakeWrapperAddress,
    chainId,
    version: 2,
  }
}

const formatV2UniversalFarmToSerializedFarm = (farm: UniversalFarmConfigV2): LegacyClassicFarmConfig | undefined => {
  const { chainId, pid, bCakeWrapperAddress, lpAddress, token0, token1 } = farm

  return {
    pid,
    lpAddress,
    lpSymbol: `${token0.symbol}-${token1.symbol} LP`,
    bCakeWrapperAddress,
    token: token0,
    quoteToken: token1,
    chainId,
    version: 2,
  }
}

const formatV3UniversalFarmToSerializedFarm = (farm: UniversalFarmConfigV3): LegacyV3FarmConfig => {
  const { chainId, pid, lpAddress, token0, token1, feeAmount } = farm
  return {
    pid,
    lpAddress,
    lpSymbol: `${token0.symbol}-${token1.symbol} LP`,
    token0,
    token1,
    token: token0,
    quoteToken: token1,
    feeAmount,
    chainId,
    version: 3,
  }
}
