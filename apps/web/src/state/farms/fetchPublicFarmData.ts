import { ChainId } from '@pancakeswap/sdk'
import { erc20ABI } from 'wagmi'
import chunk from 'lodash/chunk'
import { getMasterChefV2Address } from 'utils/addressHelpers'
import { publicClient } from 'utils/wagmi'
import { SerializedFarm } from '@pancakeswap/farms'
import { SerializedFarmConfig } from '../../config/constants/types'

const fetchFarmCalls = (farm: SerializedFarm, chainId: number) => {
  const { lpAddress, token, quoteToken } = farm
  return [
    // Balance of token in the LP contract
    {
      abi: erc20ABI,
      address: token.address,
      functionName: 'balanceOf',
      args: [lpAddress],
    },
    // Balance of quote token on LP contract
    {
      abi: erc20ABI,
      address: quoteToken.address,
      functionName: 'balanceOf',
      args: [lpAddress],
    },
    // Balance of LP tokens in the master chef contract
    {
      abi: erc20ABI,
      address: lpAddress,
      functionName: 'balanceOf',
      args: [getMasterChefV2Address(chainId)],
    },
    // Total supply of LP tokens
    {
      abi: erc20ABI,
      address: lpAddress,
      functionName: 'totalSupply',
    },
    // Token decimals
    {
      abi: erc20ABI,
      address: token.address,
      functionName: 'decimals',
    },
    // Quote token decimals
    {
      abi: erc20ABI,
      address: quoteToken.address,
      functionName: 'decimals',
    },
  ] as const
}

export const fetchPublicFarmsData = async (farms: SerializedFarmConfig[], chainId = ChainId.BSC) => {
  const farmCalls = farms.flatMap((farm) => fetchFarmCalls(farm, chainId))
  const client = publicClient({ chainId })
  const farmMultiCallResult = await client.multicall({
    contracts: farmCalls,
    allowFailure: false,
  })
  const chunkSize = farmCalls.length / farms.length
  return chunk(farmMultiCallResult, chunkSize)
}
