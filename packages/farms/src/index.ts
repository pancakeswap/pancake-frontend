import { formatEther } from '@ethersproject/units'
import { MultiCallV2 } from '@pancakeswap/multicall'
import { ChainId } from '@pancakeswap/sdk'
import { masterChefAddresses, masterChefV3Addresses } from './const'
import { farmV2FetchFarms, FetchFarmsParams, fetchMasterChefV2Data } from './fetchFarmsV2'
import { farmV3FetchFarms, fetchMasterChefV3Data } from './fetchFarmsV3'

const supportedChainId = [ChainId.GOERLI, ChainId.BSC, ChainId.BSC_TESTNET, ChainId.ETHEREUM]
const supportedChainIdV3 = [ChainId.BSC_TESTNET]
export const bCakeSupportedChainId = [ChainId.BSC, ChainId.BSC_TESTNET]

export function createFarmFetcher(multicallv2: MultiCallV2) {
  const fetchFarms = async (
    params: {
      isTestnet: boolean
    } & Pick<FetchFarmsParams, 'chainId' | 'farms'>,
  ) => {
    const { isTestnet, farms, chainId } = params
    const masterChefAddress = isTestnet ? masterChefAddresses[ChainId.BSC_TESTNET] : masterChefAddresses[ChainId.BSC]
    const { poolLength, totalRegularAllocPoint, totalSpecialAllocPoint, cakePerBlock } = await fetchMasterChefV2Data({
      isTestnet,
      multicallv2,
      masterChefAddress,
    })
    const regularCakePerBlock = formatEther(cakePerBlock)
    const farmsWithPrice = await farmV2FetchFarms({
      multicallv2,
      masterChefAddress,
      isTestnet,
      chainId,
      farms: farms.filter((f) => !f.pid || poolLength.gt(f.pid)),
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
    isTestnet: (chainId: number) => ![ChainId.BSC, ChainId.ETHEREUM].includes(chainId),
  }
}

export function createFarmFetcherV3(multicallv2: MultiCallV2) {
  const fetchFarms = async (
    params: {
      //
    } & Pick<FetchFarmsParams, 'chainId' | 'farms'>,
  ) => {
    const { farms, chainId } = params

    const masterChefAddress = masterChefV3Addresses[chainId]
    if (!masterChefAddress) {
      throw new Error('Unsupported chain')
    }
    const { poolLength, totalAllocPoint } = await fetchMasterChefV3Data({
      multicallv2,
      masterChefAddress,
      chainId,
    })

    await farmV3FetchFarms({ farms, chainId, multicallv2, masterChefAddress, totalAllocPoint })

    return {
      poolLength: poolLength.toNumber(),
    }
  }

  return {
    fetchFarms,
    isChainSupported: (chainId: number) => supportedChainIdV3.includes(chainId),
    supportedChainId: supportedChainIdV3,
    isTestnet: (chainId: number) => ![ChainId.BSC, ChainId.ETHEREUM].includes(chainId),
  }
}

export * from './apr'
export * from './farmsPriceHelpers'
export * from './types'
export * from './deserializeFarmUserData'
export * from './deserializeFarm'
export { FARM_AUCTION_HOSTING_IN_SECONDS } from './const'
export * from './filterFarmsByQuery'
