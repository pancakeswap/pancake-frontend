import { ChainId } from '@pancakeswap/chains'
import { MERKL_POOLS } from 'config/merkl'
import { Address } from 'viem'

export const getMerklLink = ({
  chainId,
  lpAddress,
}: {
  chainId?: ChainId | number
  lpAddress?: Address
}): string | false => {
  if (!chainId || !lpAddress) return false

  let link: string | false = false

  MERKL_POOLS.forEach((pool) => {
    if (pool.chainId === chainId && pool.address.toLowerCase() === lpAddress.toLowerCase()) {
      // eslint-disable-next-line prefer-destructuring
      link = pool.link
    }
  })

  return link
}
