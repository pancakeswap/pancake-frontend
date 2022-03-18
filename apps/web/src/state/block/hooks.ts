import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
import useSWR, { useSWRConfig } from 'swr'
import { simpleRpcProvider } from 'utils/providers'
import useSWRImmutable from 'swr/immutable'

const REFRESH_BLOCK_INTERVAL = 6000

export const usePollBlockNumber = () => {
  const { cache, mutate } = useSWRConfig()

  const { data } = useSWR(
    'blockNumber',
    async () => {
      const blockNumber = await simpleRpcProvider.getBlockNumber()
      if (!cache.get('initialBlockNumber')) {
        mutate('initialBlockNumber', blockNumber)
      }
      return blockNumber
    },
    {
      refreshInterval: REFRESH_BLOCK_INTERVAL,
    },
  )

  useSWR(
    [FAST_INTERVAL, 'blockNumber'],
    async () => {
      return data
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )

  useSWR(
    [SLOW_INTERVAL, 'blockNumber'],
    async () => {
      return data
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )
}

export const useCurrentBlock = (): number => {
  const { data: currentBlock = 0 } = useSWRImmutable('blockNumber')
  return currentBlock
}

export const useInitialBlock = (): number => {
  const { data: initialBlock = 0 } = useSWRImmutable('initialBlockNumber')
  return initialBlock
}
