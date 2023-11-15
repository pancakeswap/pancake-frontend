import { Address, PublicClient } from 'viem'
import { useQuery } from '@tanstack/react-query'
import { getBoostedPoolApr } from '@pancakeswap/pools'

interface UseBoostedPoolApr {
  client: PublicClient
  sousId: number
  contractAddress: Address
  chainId: number | undefined
}

export const useBoostedPoolApr = ({ client, sousId, contractAddress, chainId }: UseBoostedPoolApr): number => {
  const { data } = useQuery(
    ['boostedPoolsApr'],
    () =>
      getBoostedPoolApr({
        client,
        chainId,
        sousId,
        contractAddress,
      }),
    {
      enabled: Boolean(client && sousId && contractAddress && chainId),
    },
  )

  return data ?? 0
}
