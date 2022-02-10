import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
import useSWR from 'swr'
import { simpleRpcProvider } from 'utils/providers'
import useSWRImmutable from 'swr/immutable'
import { useEffect, useState } from 'react'
import usePrevious from '../../hooks/usePreviousValue'

const REFRESH_BLOCK_INTERVAL = 6000

export const usePollBlockNumber = () => {
  const { data } = useSWR(
    ['blockNumber'],
    async () => {
      return simpleRpcProvider.getBlockNumber()
    },
    {
      refreshInterval: REFRESH_BLOCK_INTERVAL,
      fallbackData: 0,
    },
  )

  const { mutate: refreshInitialBlock } = useSWRImmutable(
    ['initialBlockNumber'],
    async () => {
      return data
    },
    { fallbackData: 0 },
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

export const useCurrentBlock = () => {
  const { data: currentBlock } = useSWRImmutable(['blockNumber'])
  return currentBlock
}

export const useInitialBlock = () => {
  const [initialBlock, setInitialBlock] = useState(0)
  const { data: blockNumber } = useSWRImmutable(['blockNumber'])

  useEffect(() => {
    if (blockNumber && !initialBlock) {
      setInitialBlock(blockNumber)
    }
  }, [blockNumber, initialBlock])

  return initialBlock
}
