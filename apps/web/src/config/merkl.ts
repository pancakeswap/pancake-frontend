import { ChainId } from '@pancakeswap/chains'
import type { Address } from 'viem'

type MerklPool = {
  chainId: ChainId
  // lp address
  address: Address
  // link to merkl.angle.money
  link: string
}

export const MERKL_POOLS: MerklPool[] = [
  {
    chainId: ChainId.ETHEREUM,
    address: '0x2201d2400d30BFD8172104B4ad046d019CA4E7bd',
    link: 'https://merkl.angle.money/?times=active%2Cfuture%2C&phrase=RETH&chains=1%2C',
  },
]
