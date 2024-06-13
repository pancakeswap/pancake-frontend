import { Ifo, ifoV7ABI } from '@pancakeswap/ifos'
import { useQuery } from '@tanstack/react-query'

import { publicClient } from 'utils/wagmi'

import { useActiveIfoConfig } from './useIfoConfig'

export const useActiveIfoWithTimestamps = (): (Ifo & { startTimestamp: number; endTimestamp: number }) | null => {
  const { activeIfo } = useActiveIfoConfig()

  const { data: currentIfoBlocks = { startTimestamp: 0, endTimestamp: 0 } } = useQuery({
    queryKey: ['ifo', 'currentIfo'],

    queryFn: async () => {
      if (!activeIfo?.address) {
        return {
          startTimestamp: 0,
          endTimestamp: 0,
        }
      }

      const client = publicClient({ chainId: activeIfo.chainId })
      const [start, end] = await client.multicall({
        contracts: [
          {
            address: activeIfo.address,
            abi: ifoV7ABI,
            functionName: 'startTimestamp',
          },
          {
            address: activeIfo.address,
            abi: ifoV7ABI,
            functionName: 'endTimestamp',
          },
        ],
        allowFailure: false,
      })

      return {
        startTimestamp: Number(start),
        endTimestamp: Number(end),
      }
    },

    enabled: Boolean(activeIfo),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  return activeIfo ? { ...activeIfo, ...currentIfoBlocks } : null
}
