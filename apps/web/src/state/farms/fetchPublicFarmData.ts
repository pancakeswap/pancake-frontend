import { ChainId } from '@pancakeswap/sdk'
import { erc20ABI } from 'wagmi'
import chunk from 'lodash/chunk'
import { getMasterChefV2Address } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import { SerializedFarm } from '@pancakeswap/farms'
import { SerializedFarmConfig } from '../../config/constants/types'

const fetchFarmCalls = (farm: SerializedFarm, chainId: number) => {
  const { lpAddress, token, quoteToken } = farm
  return [
    // Balance of token in the LP contract
    {
      address: token.address,
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of quote token on LP contract
    {
      address: quoteToken.address,
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of LP tokens in the master chef contract
    {
      address: lpAddress,
      name: 'balanceOf',
      params: [getMasterChefV2Address(chainId)],
    },
    // Total supply of LP tokens
    {
      address: lpAddress,
      name: 'totalSupply',
    },
    // Token decimals
    {
      address: token.address,
      name: 'decimals',
    },
    // Quote token decimals
    {
      address: quoteToken.address,
      name: 'decimals',
    },
  ]
}

export const fetchPublicFarmsData = async (farms: SerializedFarmConfig[], chainId = ChainId.BSC): Promise<any[]> => {
  const farmCalls = farms.flatMap((farm) => fetchFarmCalls(farm, chainId))
  const chunkSize = farmCalls.length / farms.length
  const farmMultiCallResult = await multicallv2({ abi: erc20ABI, calls: farmCalls, chainId })
  return chunk(farmMultiCallResult, chunkSize)
}
