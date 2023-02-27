import erc20 from 'config/abi/erc20.json'
import chunk from 'lodash/chunk'
import { getMasterChefV1Address } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import { SerializedFarm } from '@pancakeswap/farms'
import { SerializedFarmConfig } from '../../config/constants/types'

const fetchFarmCalls = (farm: SerializedFarm) => {
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
      params: [getMasterChefV1Address()],
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

export const fetchPublicFarmsData = async (farms: SerializedFarmConfig[]): Promise<any[]> => {
  const farmCalls = farms.flatMap((farm) => fetchFarmCalls(farm))
  const chunkSize = farmCalls.length / farms.length
  const farmMultiCallResult = await multicallv2({ abi: erc20, calls: farmCalls })
  return chunk(farmMultiCallResult, chunkSize)
}
