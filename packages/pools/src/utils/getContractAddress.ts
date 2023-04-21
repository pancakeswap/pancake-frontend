import { ChainId } from '@pancakeswap/sdk'

import { ContractAddresses } from '../constants/contracts'
import { isPoolsSupported } from './isPoolsSupported'

export function getContractAddress(addresses: ContractAddresses, chainId: ChainId) {
  if (!isPoolsSupported(chainId)) {
    throw new Error(`Cannot get contract address. Unsupported chain ${chainId}`)
  }
  return addresses[chainId]
}
