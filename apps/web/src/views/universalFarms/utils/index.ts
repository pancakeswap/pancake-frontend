import { CHAINS } from 'config/chains'
import type { ChainId } from '@pancakeswap/chains'

export function getChainFullName(chainId: ChainId) {
  return CHAINS.find((chain) => chain.id === chainId)?.name
}
