import { ChainId } from '@pancakeswap/sdk'

import { ContractAddresses } from '../constants/contracts'
import { isIfoSupported } from './isIfoSupported'

export function getContractAddress(addresses: ContractAddresses, chainId?: ChainId) {
  if (!isIfoSupported(chainId)) {
    throw new Error(`Cannot get contract address. Unsupported chain ${chainId}`)
  }
  return addresses[chainId]
}
