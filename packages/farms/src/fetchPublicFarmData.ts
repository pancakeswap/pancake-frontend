import { ChainId } from '@pancakeswap/sdk'
import chunk from 'lodash/chunk'
import { getMasterChefAddress } from 'utils/addressHelpers'
import { SerializedFarmPublicData, SerializedFarmConfig } from './types'

const abi = [
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
]

const fetchFarmCalls = (farm: SerializedFarmPublicData, chainId: number) => {
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

export const fetchPublicFarmsData = async (
  farms: SerializedFarmConfig[],
  chainId = ChainId.BSC,
  multicall,
): Promise<any[]> => {
  try {
    const farmCalls = farms.flatMap((farm) => fetchFarmCalls(farm, chainId))
    const chunkSize = farmCalls.length / farms.length
    const farmMultiCallResult = await multicall({ abi, calls: farmCalls, chainId })
    return chunk(farmMultiCallResult, chunkSize)
  } catch (error) {
    console.error('MasterChef Public Data error ', error)
    throw error
  }
}
