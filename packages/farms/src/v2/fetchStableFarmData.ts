import { PublicClient, parseUnits } from 'viem'
import { ChainId } from '@pancakeswap/sdk'
import chunk from 'lodash/chunk'
import { SerializedStableFarmConfig } from '../types'

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
] as const

export async function fetchStableFarmData(
  farms: SerializedStableFarmConfig[],
  chainId = ChainId.BSC,
  provider: ({ chainId }: { chainId: number }) => PublicClient,
) {
  const calls = farms.flatMap(
    (f) =>
      [
        {
          abi: stableSwapAbi,
          address: f.stableSwapAddress,
          functionName: 'balances',
          args: [0n],
        },
        {
          abi: stableSwapAbi,
          address: f.stableSwapAddress,
          functionName: 'balances',
          args: [1n],
        },
        {
          abi: stableSwapAbi,
          address: f.stableSwapAddress,
          functionName: 'get_dy',
          args: [0n, 1n, parseUnits('1', f.token.decimals)],
        },
        {
          abi: stableSwapAbi,
          address: f.stableSwapAddress,
          functionName: 'get_dy',
          args: [1n, 0n, parseUnits('1', f.quoteToken.decimals)],
        },
      ] as const,
  )

  const chunkSize = calls.length / farms.length

  const results = await provider({ chainId }).multicall({
    contracts: calls,
    allowFailure: false,
  })

  return chunk(results, chunkSize)
}
