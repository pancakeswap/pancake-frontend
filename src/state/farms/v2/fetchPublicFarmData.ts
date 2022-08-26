import erc20 from 'config/abi/erc20.json'
import { ChainId } from '@pancakeswap/sdk'
import chunk from 'lodash/chunk'
import { getMasterChefAddress } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import { SerializedFarm } from '../../types'
import { SerializedFarmConfig } from '../../../config/constants/types'

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
      params: [getMasterChefAddress(chainId)],
    },
    // Total supply of LP tokens
    {
      address: lpAddress,
      name: 'totalSupply',
    },
  ]
}

export const fetchPublicFarmsData = async (farms: SerializedFarmConfig[], chainId = ChainId.BSC): Promise<any[]> => {
  try {
    const farmCalls = farms.flatMap((farm) => fetchFarmCalls(farm, chainId))
    const chunkSize = farmCalls.length / farms.length
    const farmMultiCallResult = await multicallv2({ abi: erc20, calls: farmCalls, chainId })
    return chunk(farmMultiCallResult, chunkSize)
  } catch (error) {
    console.error('MasterChef Public Data error ', error)
    throw error
  }
}
