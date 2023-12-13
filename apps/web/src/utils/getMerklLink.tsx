import { ChainId } from '@pancakeswap/chains'
import MERKL_POOLS from 'config/constants/merklPools.json'
import { Address } from 'viem'

export const getMerklLink = ({
  chainId,
  lpAddress,
}: {
  chainId?: ChainId | number
  lpAddress?: Address
}): string | undefined => {
  if (!chainId || !lpAddress) return undefined

  let link: string | undefined

  MERKL_POOLS.forEach((pool) => {
    if (pool.chainId === chainId && pool.address.toLowerCase() === lpAddress.toLowerCase()) {
      // eslint-disable-next-line prefer-destructuring
      link = pool.link
    }
  })

  return link
}
