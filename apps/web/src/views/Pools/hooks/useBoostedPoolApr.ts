import { getBoostedPoolApr } from '@pancakeswap/pools'
import { useQuery } from '@tanstack/react-query'
import { getViemClients } from 'utils/viem'
import { Address } from 'viem'

interface UseBoostedPoolApr {
  contractAddress: Address
  chainId: number | undefined
  isFinished: boolean
}

export const useBoostedPoolApr = ({ contractAddress, chainId, isFinished }: UseBoostedPoolApr): number => {
  const client = getViemClients({ chainId })

  const { data } = useQuery(
    ['boostedPoolsApr', contractAddress, chainId],
    () => {
      if (client && !isFinished) {
        return getBoostedPoolApr({
          client,
          chainId,
          contractAddress,
        })
      }

      return 0
    },
    {
      enabled: Boolean(client && contractAddress && chainId),
    },
  )

  return data ?? 0
}
