import { ChainId } from '@pancakeswap/chains'
import type { Address } from 'viem'

type MerklPool = {
  chainId: ChainId
  // lp address
  address: Address
  // link to merkl.angle.money
  link: string
}

const DISTRIBUTOR_ADDRESS = '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae' as const

export const DISTRIBUTOR_ADDRESSES = {
  [ChainId.ETHEREUM]: DISTRIBUTOR_ADDRESS,
  [ChainId.BSC]: DISTRIBUTOR_ADDRESS,
  [ChainId.LINEA]: DISTRIBUTOR_ADDRESS,
  [ChainId.BASE]: DISTRIBUTOR_ADDRESS,
  [ChainId.ARBITRUM_ONE]: DISTRIBUTOR_ADDRESS,
  [ChainId.POLYGON_ZKEVM]: DISTRIBUTOR_ADDRESS,
}

export const MERKL_POOLS: MerklPool[] = [
  {
    chainId: ChainId.ETHEREUM,
    address: '0x2201d2400d30BFD8172104B4ad046d019CA4E7bd',
    link: 'https://merkl.angle.money/?times=active%2Cfuture%2C&phrase=RETH&chains=1%2C',
  },
  {
    chainId: ChainId.POLYGON_ZKEVM,
    address: '0x39aCc7cf02af19A1eB0e3628bA0F5C48f44beBF3',
    link: 'https://merkl.angle.money/?times=active%2Cfuture%2C&phrase=grai&chains=1101%2C',
  },
]
