import { ChainId } from '@pancakeswap/chains'
import type { Address } from 'viem'

type MerklPool = {
  chainId: ChainId
  address: Address
}

export const MERKL_POOLS: MerklPool[] = [
  {
    chainId: ChainId.ETHEREUM,
    address: '0x2201d2400d30BFD8172104B4ad046d019CA4E7bd',
  },
]
