import { ChainId } from '@pancakeswap/chains'
import { MERKL_POOLS } from 'config/merkl'
import { Address } from 'viem'

export const useIsMerkl = ({ chainId, lpAddress }: { chainId?: ChainId | number; lpAddress?: Address }) => {
  if (!chainId || !lpAddress) return false

  return MERKL_POOLS.some((pool) => pool.chainId === chainId && pool.address.toLowerCase() === lpAddress.toLowerCase())
}
