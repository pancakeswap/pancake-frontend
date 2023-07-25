import useSWRImmutable from 'swr/immutable'
import { useMemo } from 'react'
import { ChainId } from '@pancakeswap/sdk'

import { publicClient } from 'utils/wagmi'
import { ifoV7ABI } from 'config/abi/ifoV7'
import { ifosConfig } from 'config/constants'

const activeIfo = ifosConfig.find((ifo) => ifo.isActive)

export const useIfoStatus = () => {
  const { data = { startTime: 0, endTime: 0 } } = useSWRImmutable(
    activeIfo ? ['ifo', 'currentIfo_timestamps'] : null,
    async () => {
      const bscClient = publicClient({ chainId: ChainId.BSC })
      const [startTimeResponse, endTimeResponse] = await bscClient.multicall({
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
  )

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
