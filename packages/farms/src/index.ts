import { ChainId } from '@pancakeswap/chains'
import BigNumber from 'bignumber.js'
import { PublicClient, formatEther } from 'viem'
import {
  FarmSupportedChainId,
  FarmV2SupportedChainId,
  FarmV3SupportedChainId,
  FarmV4SupportedChainId,
  bCakeSupportedChainId,
  masterChefAddresses,
  masterChefV3Addresses,
  supportedChainId,
  supportedChainIdV2,
  supportedChainIdV3,
  supportedChainIdV4,
} from './const'
import {
  CommonPrice,
  LPTvl,
  farmV3FetchFarms,
  fetchCommonTokenUSDValue,
  fetchMasterChefV3Data,
  fetchTokenUSDValues,
  getCakeApr,
} from './fetchFarmsV3'
import { ComputedFarmConfigV3, FarmV3DataWithPrice } from './types'
import { FetchFarmsParams, farmV2FetchFarms, fetchMasterChefV2Data } from './v2/fetchFarmsV2'

export {
  bCakeSupportedChainId,
  supportedChainId,
  supportedChainIdV2,
  supportedChainIdV3,
  supportedChainIdV4,
  type FarmSupportedChainId,
  type FarmV3SupportedChainId,
  type FarmV4SupportedChainId,
}

export function createFarmFetcher(provider: ({ chainId }: { chainId: FarmV2SupportedChainId }) => PublicClient) {
  const fetchFarms = async (
    params: {
      isTestnet: boolean
    } & Pick<FetchFarmsParams, 'chainId' | 'farms'>,
  ) => {
    const { isTestnet, farms, chainId } = params
    const masterChefAddress = isTestnet ? masterChefAddresses[ChainId.BSC_TESTNET] : masterChefAddresses[ChainId.BSC]
    const { poolLength, totalRegularAllocPoint, totalSpecialAllocPoint, cakePerBlock } = await fetchMasterChefV2Data({
      isTestnet,
      provider,
      masterChefAddress,
    })
    const regularCakePerBlock = formatEther(cakePerBlock)
    const farmsWithPrice = await farmV2FetchFarms({
      provider,
      masterChefAddress,
      isTestnet,
      chainId,
      farms: farms.filter((f) => !f.pid || poolLength > f.pid),
      totalRegularAllocPoint,
      totalSpecialAllocPoint,
    })

    return {
      farmsWithPrice,
      poolLength: Number(poolLength),
      regularCakePerBlock: +regularCakePerBlock,
      totalRegularAllocPoint: totalRegularAllocPoint.toString(),
    }
  }

  return {
    fetchFarms,
    isChainSupported: (chainId: number) => supportedChainIdV2.includes(chainId),
    supportedChainId: supportedChainIdV2,
    isTestnet: (chainId: number) => ![ChainId.BSC, ChainId.ETHEREUM].includes(chainId),
  }
}

export function createFarmFetcherV3(provider: ({ chainId }: { chainId: number }) => PublicClient) {
  const fetchFarms = async ({
    farms,
    chainId,
    commonPrice,
  }: {
    farms: ComputedFarmConfigV3[]
    chainId: FarmV3SupportedChainId
    commonPrice: CommonPrice
  }) => {
    const masterChefAddress = masterChefV3Addresses[chainId]
    if (!masterChefAddress || !provider) {
      throw new Error('Unsupported chain')
    }

    try {
      const { poolLength, totalAllocPoint, latestPeriodCakePerSecond } = await fetchMasterChefV3Data({
        provider,
        masterChefAddress,
        chainId,
      })

      const cakePerSecond = new BigNumber(latestPeriodCakePerSecond.toString()).div(1e18).div(1e12).toString()

      const farmsWithPrice = await farmV3FetchFarms({
        farms,
        chainId,
        provider,
        masterChefAddress,
        totalAllocPoint,
        commonPrice,
      })

      return {
        chainId,
        poolLength: Number(poolLength),
        farmsWithPrice,
        cakePerSecond,
        totalAllocPoint: totalAllocPoint.toString(),
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getCakeAprAndTVL = (
    farm: FarmV3DataWithPrice,
    lpTVL: LPTvl,
    cakePrice: string,
    cakePerSecond: string,
    boosterLiquidityX?: number,
  ) => {
    const [token0Price, token1Price] = farm.token.sortsBefore(farm.quoteToken)
      ? [farm.tokenPriceBusd, farm.quoteTokenPriceBusd]
      : [farm.quoteTokenPriceBusd, farm.tokenPriceBusd]
    const tvl = new BigNumber(token0Price).times(lpTVL.token0).plus(new BigNumber(token1Price).times(lpTVL.token1))

    const cakeApr = getCakeApr(farm.poolWeight, tvl.times(boosterLiquidityX ?? 1), cakePrice, cakePerSecond)

    return {
      activeTvlUSD: tvl.toString(),
      activeTvlUSDUpdatedAt: lpTVL.updatedAt,
      cakeApr,
    }
  }

  return {
    fetchFarms,
    getCakeAprAndTVL,
    isChainSupported: (chainId: number): chainId is FarmV3SupportedChainId => supportedChainIdV3.includes(chainId),
    supportedChainId: supportedChainIdV3,
    isTestnet: (chainId: number) => ![ChainId.BSC, ChainId.ETHEREUM].includes(chainId),
  }
}

export * from './apr'
export { FARM_AUCTION_HOSTING_IN_SECONDS } from './const'
export * from './defineFarmV3Configs'
export * from './farms'
export * from './fetchUniversalFarms'
export * from './getLegacyFarmConfig'
export * from './types'
export * from './utils'
export * from './v2/deserializeFarm'
export * from './v2/deserializeFarmUserData'
export type { FarmWithPrices } from './v2/farmPrices'
export * from './v2/farmsPriceHelpers'
export * from './v2/filterFarmsByQuery'

export { fetchCommonTokenUSDValue, fetchTokenUSDValues, masterChefV3Addresses }
