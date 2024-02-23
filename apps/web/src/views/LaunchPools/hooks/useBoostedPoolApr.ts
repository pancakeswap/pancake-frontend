import { getBoostedPoolApr } from '@pancakeswap/pools'
import { useQuery } from '@tanstack/react-query'
import { getViemClients } from 'utils/viem'
import { Address } from 'viem'

interface UseBoostedPoolApr {
  contractAddress: Address
  chainId: number | undefined
  enabled: boolean
}

export const useBoostedPoolApr = ({ contractAddress, chainId, enabled }: UseBoostedPoolApr): number => {
  const client = getViemClients({ chainId })

  const { data } = useQuery({
    queryKey: ['boostedPoolsApr', contractAddress, chainId],

    queryFn: () => {
      if (client) {
        return getBoostedPoolApr({
          client,
          chainId,
          contractAddress,
        })
      }

      return 0
    },

    enabled: Boolean(enabled && client && contractAddress && chainId),
  })

  return data ?? 0
}
