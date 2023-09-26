import { ChainId } from '@pancakeswap/chains'

import { CAKE_FLEXIBLE_SIDE_VAULT, CAKE_VAULT } from '../constants/contracts'
import { getContractAddress } from '../utils'

export function getCakeFlexibleSideVaultAddress(chainId: ChainId) {
  return getContractAddress(CAKE_FLEXIBLE_SIDE_VAULT, chainId)
}

export function getCakeVaultAddress(chainId: ChainId) {
  return getContractAddress(CAKE_VAULT, chainId)
}
