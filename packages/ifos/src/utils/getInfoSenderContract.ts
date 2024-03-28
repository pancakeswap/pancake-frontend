import { ChainId } from '@pancakeswap/sdk'
import { Address, GetContractReturnType, PublicClient, getContract } from 'viem'

import { pancakeInfoSenderABI } from '../abis/PancakeInfoSender'
import { INFO_SENDER } from '../constants/contracts'
import { OnChainProvider } from '../types'
import { isNativeIfoSupported } from './isIfoSupported'

type Params = {
  chainId?: ChainId
  provider: OnChainProvider
}

export function getInfoSenderContract({
  chainId,
  provider,
}: Params): GetContractReturnType<typeof pancakeInfoSenderABI, PublicClient, Address> {
  if (!isNativeIfoSupported(chainId)) {
    throw new Error(`Cannot get info sender contract because native ifo is not supported on ${chainId}`)
  }
  const senderContractAddress = INFO_SENDER[chainId]
  return getContract({
    abi: pancakeInfoSenderABI,
    address: senderContractAddress,
    // TODO: Fix viem
    // @ts-ignore
    publicClient: provider({ chainId }),
  }) as GetContractReturnType<typeof pancakeInfoSenderABI, PublicClient, Address>
}
