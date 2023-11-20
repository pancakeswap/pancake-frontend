import { Address } from 'viem'
import { useQuery } from '@tanstack/react-query'
import { getViemClients } from 'utils/viem'
import { getBoostedPoolApr } from '@pancakeswap/pools'

interface UseBoostedPoolApr {
  sousId: number
  contractAddress: Address
  chainId: number | undefined
}

export const useBoostedPoolApr = ({ sousId, contractAddress, chainId }: UseBoostedPoolApr): number => {
  const client = getViemClients({ chainId })

  const { data } = useQuery(
    ['boostedPoolsApr'],
    () => {
      if (client) {
        return getBoostedPoolApr({
          client,
          chainId,
          sousId,
          contractAddress,
        })
      }

      return 0
    },
    {
      enabled: Boolean(client && sousId && contractAddress && chainId),
    },
  )

  return data ?? 0
}
