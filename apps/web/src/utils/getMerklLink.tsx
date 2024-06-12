import { ChainId } from '@pancakeswap/chains'
import MERKL_POOLS from 'config/constants/merklPools.json'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

type MerklPools = {
  chainId: ChainId
  address: Address
  link: string
}[]

export const getMerklLink = ({
  chainId,
  lpAddress,
}: {
  chainId?: ChainId | number
  lpAddress?: Address
}): string | undefined => {
  if (!chainId || !lpAddress || !MERKL_POOLS.length) return undefined

  let link: string | undefined
  ;(MERKL_POOLS as MerklPools).forEach((pool) => {
    if (pool.chainId === chainId && pool.address.toLowerCase() === lpAddress.toLowerCase()) {
      // eslint-disable-next-line prefer-destructuring
      link = pool.link
    }
  })

  return link
}

export const useMerklUserLink = (): string => {
  const { address: account } = useAccount()
  const link = useMemo(() => {
    return `https://merkl.angle.money/user/${account ?? ''}`
  }, [account])
  return link
}
