import { ChainId } from '@pancakeswap/sdk'
import { GetContractReturnType, PublicClient, getContract } from 'viem'

import { OnChainProvider } from './types'
import { MULTICALL_ADDRESS } from './constants/contracts'
import { iMulticallABI } from './abis/IMulticall'

type Params = {
  chainId: ChainId
  provider?: OnChainProvider
}

export function getMulticallContract({
  chainId,
  provider,
}: Params): GetContractReturnType<typeof iMulticallABI, PublicClient> {
  const address = MULTICALL_ADDRESS[chainId]
  if (!address) {
    throw new Error(`PancakeMulticall not supported on chain ${chainId}`)
  }

  return getContract({ abi: iMulticallABI, address, publicClient: provider?.({ chainId }) })
}
