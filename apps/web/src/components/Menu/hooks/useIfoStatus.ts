import { ifoV7ABI } from '@pancakeswap/ifos'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { useActiveIfoConfigAcrossChains } from 'hooks/useIfoConfig'
import { publicClient } from 'utils/wagmi'

export const useIfoStatus = () => {
  const activeIfo = useActiveIfoConfigAcrossChains()

  const { data = { startTime: 0, endTime: 0 } } = useQuery({
    queryKey: ['ifo', 'currentIfo_timestamps', activeIfo?.chainId],

    queryFn: async () => {
      const client = publicClient({ chainId: activeIfo?.chainId })
      if (!client || !activeIfo?.chainId) {
        return {
          startTime: 0,
          endTime: 0,
        }
      }

      const [startTimeResponse, endTimeResponse] = await client.multicall({
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
      })

      return {
        startTime: startTimeResponse.status === 'success' ? Number(startTimeResponse.result) : 0,
        endTime: endTimeResponse.status === 'success' ? Number(endTimeResponse.result) : 0,
      }
    },

    enabled: Boolean(activeIfo),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return useMemo(() => {
    const { startTime, endTime } = data
    const now = Math.floor(Date.now() / 1000)
    if (now < startTime) {
      return 'soon'
    }

    if (now >= startTime && now <= endTime) {
      return 'live'
    }

    return null
  }, [data])
}
