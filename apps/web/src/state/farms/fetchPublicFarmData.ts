import { ChainId } from '@pancakeswap/chains'
import { SerializedFarm } from '@pancakeswap/farms'
import chunk from 'lodash/chunk'
import { getMasterChefV2Address } from 'utils/addressHelpers'
import { publicClient } from 'utils/wagmi'
import { erc20Abi } from 'viem'
import { SerializedFarmConfig } from '../../config/constants/types'

const fetchFarmCalls = (farm: SerializedFarm, chainId: number) => {
  const { lpAddress, token, quoteToken } = farm
  return [
    // Balance of token in the LP contract
    {
      abi: erc20Abi,
      address: token.address,
      functionName: 'balanceOf',
      args: [lpAddress],
    },
    // Balance of quote token on LP contract
    {
      abi: erc20Abi,
      address: quoteToken.address,
      functionName: 'balanceOf',
      args: [lpAddress],
    },
    // Balance of LP tokens in the master chef contract
    {
      abi: erc20Abi,
      address: lpAddress,
      functionName: 'balanceOf',
      args: [getMasterChefV2Address(chainId)],
    },
    // Total supply of LP tokens
    {
      abi: erc20Abi,
      address: lpAddress,
      functionName: 'totalSupply',
    },
    // Token decimals
    {
      abi: erc20Abi,
      address: token.address,
      functionName: 'decimals',
    },
    // Quote token decimals
    {
      abi: erc20Abi,
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
