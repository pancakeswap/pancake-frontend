import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
import useSWR, { useSWRConfig } from 'swr'
import useSWRImmutable from 'swr/immutable'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const REFRESH_BLOCK_INTERVAL = 6000

export const usePollBlockNumber = () => {
  const { cache, mutate } = useSWRConfig()
  const { library, chainId } = useActiveWeb3React()

  const { data } = useSWR(
    `blockNumber-${chainId}`,
    async () => {
      const blockNumber = await library.getBlockNumber()
      if (!cache.get(`initialBlockNumber-${chainId}`)) {
        mutate(`initialBlockNumber-${chainId}`, blockNumber)
      }
      return blockNumber
    },
    {
      refreshInterval: REFRESH_BLOCK_INTERVAL,
    },
  )

  useSWR(
    [FAST_INTERVAL, 'blockNumber', chainId],
    async () => {
      return data
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )

  useSWR(
    [SLOW_INTERVAL, 'blockNumber', chainId],
    async () => {
      return data
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )
}

export const useCurrentBlock = (): number => {
  const { chainId } = useActiveWeb3React()
  const { data: currentBlock = 0 } = useSWRImmutable(`blockNumber-${chainId}`)
  return currentBlock
}

export const useInitialBlock = (): number => {
  const { chainId } = useActiveWeb3React()
  const { data: initialBlock = 0 } = useSWRImmutable(`initialBlockNumber-${chainId}`)
  return initialBlock
}
