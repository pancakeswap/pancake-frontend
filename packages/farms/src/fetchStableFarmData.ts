import { parseUnits } from '@ethersproject/units'
import { Call, MultiCallV2 } from '@pancakeswap/multicall'
import { ChainId } from '@pancakeswap/sdk'
import chunk from 'lodash/chunk'
import { SerializedStableFarmConfig } from './types'

const stableSwapAbi = [
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'coins',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'balances',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'i', type: 'uint256' },
      { internalType: 'uint256', name: 'j', type: 'uint256' },
      { internalType: 'uint256', name: 'dx', type: 'uint256' },
    ],
    name: 'get_dy',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
]

export async function fetchStableFarmData(
  farms: SerializedStableFarmConfig[],
  chainId = ChainId.BSC,
  multicallv2: MultiCallV2,
) {
  const calls: Call[] = farms.flatMap((f) => [
    {
      address: f.stableSwapAddress,
      name: 'balances',
      params: [0],
    },
    {
      address: f.stableSwapAddress,
      name: 'balances',
      params: [1],
    },
    {
      address: f.stableSwapAddress,
      name: 'get_dy',
      params: [0, 1, parseUnits('1', f.token.decimals)],
    },
    {
      address: f.stableSwapAddress,
      name: 'get_dy',
      params: [1, 0, parseUnits('1', f.quoteToken.decimals)],
    },
  ])

  const chunkSize = calls.length / farms.length

  const results = await multicallv2({
    abi: stableSwapAbi,
    calls,
    chainId,
  })

  return chunk(results, chunkSize)
}
