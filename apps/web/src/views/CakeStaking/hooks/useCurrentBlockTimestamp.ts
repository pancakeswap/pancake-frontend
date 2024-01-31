import { publicClient } from 'utils/wagmi'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'

export const useCurrentBlockTimestamp = () => {
  const { chainId } = useActiveChainId()

  const { data } = useQuery({
    queryKey: ['/gauges/currentBlockTimestamp', chainId],

    queryFn: async () => {
      const block = await publicClient({ chainId }).getBlock({ blockTag: 'latest' })
      return Number(block.timestamp)
    },
  })

  return data ?? dayjs().unix()
}
