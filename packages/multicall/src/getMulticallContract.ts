import { ChainId } from '@pancakeswap/chains'
import { GetContractReturnType, PublicClient, getContract, Address } from 'viem'

import { MULTICALL_ADDRESS, MULTICALL3_ADDRESSES, MULTICALL3_ADDRESS } from './constants/contracts'
import { iMulticallABI } from './abis/IMulticall'

type Params = {
  chainId: ChainId
  client?: PublicClient
}

export function getMulticallContract({
  chainId,
  client,
}: Params): GetContractReturnType<typeof iMulticallABI, PublicClient> {
  const address = MULTICALL_ADDRESS[chainId]
  if (!address) {
    throw new Error(`PancakeMulticall not supported on chain ${chainId}`)
  }

  return getContract({ abi: iMulticallABI, address, publicClient: client })
}

export function getMulticall3ContractAddress(chainId?: ChainId): Address {
  return MULTICALL3_ADDRESSES[chainId || ChainId.BSC] || MULTICALL3_ADDRESS
}
