import { formatEther } from '@ethersproject/units'
import { MultiCallV2 } from '@pancakeswap/multicall'
import { farmV2FetchFarms, FetchFarmsParams, fetchMasterChefV2Data } from './fetchFarms'
import type { FarmWithPrices } from './farmPrices'
import { getFarmsPriceHelperLpFiles } from '../constants/priceHelperLps/getFarmsPriceHelperLpFiles'

export const masterChefAddresses = {
  97: '0xB4A466911556e39210a6bB2FaECBB59E4eB7E43d',
  56: '0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652',
}

export const nonBSCVaultAddresses = {
  5: '0x8CB958bBdb45597cc918147469eb650A9397aBDA',
}

const supportedChainId = [5, 56, 97]

export function createFarmFetcher(multicall: MultiCallV2) {
  const fetchFarms = async (
    params: {
      isTestnet: boolean
    } & Pick<FetchFarmsParams, 'chainId' | 'farms'>,
  ) => {
    const { isTestnet, farms, chainId } = params
    const { poolLength, totalRegularAllocPoint, totalSpecialAllocPoint, cakePerBlock } = await fetchMasterChefV2Data({
      isTestnet,
      multicall,
      masterChefAddresses,
    })
    const regularCakePerBlock = formatEther(cakePerBlock)
    const priceHelperLpsConfig = getFarmsPriceHelperLpFiles(chainId)
    const farmsWithPrice = await farmV2FetchFarms({
      multicall,
      masterChefAddresses,
      isTestnet,
      chainId,
      farms: farms.filter((f) => poolLength.gt(f.pid)).concat(priceHelperLpsConfig),
      totalRegularAllocPoint,
      totalSpecialAllocPoint,
    })

    return {
      farmsWithPrice,
      poolLength: poolLength.toNumber(),
      regularCakePerBlock: +regularCakePerBlock,
    }
  }
  return {
    fetchFarms,
    isChainSupported: (chainId: number) => supportedChainId.includes(chainId),
    supportedChainId,
    isTestnet: (chainId: number) => ![56].includes(chainId),
  }
}

export * from './types'
export * from './farmsPriceHelpers'
export * from './apr'
export type { FarmWithPrices }
