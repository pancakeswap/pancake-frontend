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
  {
    chainId: ChainId.ETHEREUM,
    address: '0x4D4c8F2f30e0224889ab578283A844e10B57e0F8',
    link: 'https://merkl.angle.money/?times=active%2Cfuture%2C&phrase=ethx&chains=1%2C',
  },
  {
    chainId: ChainId.POLYGON_ZKEVM,
    address: '0x39aCc7cf02af19A1eB0e3628bA0F5C48f44beBF3',
    link: 'https://merkl.angle.money/?times=active%2Cfuture%2C&phrase=grai&chains=1101%2C',
  },
]
