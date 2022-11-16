import { formatEther } from '@ethersproject/units'
import { MultiCallV2 } from '@pancakeswap/multicall'
import { ChainId } from '@pancakeswap/sdk'
import { masterChefAddresses } from './const'
import { farmV2FetchFarms, FetchFarmsParams, fetchMasterChefV2Data } from './fetchFarms'

const supportedChainId = [ChainId.BSC, ChainId.BITGERT]
export const bCakeSupportedChainId = [ChainId.BSC]

export function createFarmFetcher(multicallv2: MultiCallV2) {
  const fetchFarms = async (
    params: {
      isTestnet: boolean
    } & Pick<FetchFarmsParams, 'chainId' | 'farms'>,
  ) => {
    const { farms, chainId } = params
    const masterChefAddress = masterChefAddresses[chainId]
    const { poolLength, totalRegularAllocPoint, totalSpecialAllocPoint, icePerBlock } = await fetchMasterChefV2Data({
      multicallv2,
      masterChefAddress,
      chainId
    })
    const regularCakePerBlock = formatEther(icePerBlock)
    const farmsWithPrice = await farmV2FetchFarms({
      multicallv2,
      masterChefAddress,
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
  }
}

export * from './apr'
export * from './farmsPriceHelpers'
export * from './types'
