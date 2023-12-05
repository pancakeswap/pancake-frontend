import { ChainId } from '@pancakeswap/sdk'
import { getContract } from 'viem'

import { isNativeIfoSupported } from './isIfoSupported'
import { INFO_SENDER } from '../constants/contracts'
import { pancakeInfoSenderABI } from '../abis/PancakeInfoSender'
import { OnChainProvider } from '../types'

type Params = {
  chainId?: ChainId
  provider: OnChainProvider
}

export function getInfoSenderContract({ chainId, provider }: Params) {
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
  })
}
