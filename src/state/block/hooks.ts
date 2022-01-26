import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import useSWR from 'swr'
import { simpleRpcProvider } from 'utils/providers'
import { setBlock } from '.'
import { State } from '../types'

const REFRESH_BLOCK_INTERVAL = 6000

export const usePollBlockNumber = () => {
  const dispatch = useAppDispatch()

  const { data } = useSWR(
    ['blockNumber'],
    async () => {
      const blockNumber = await simpleRpcProvider.getBlockNumber()
      dispatch(setBlock(blockNumber))
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

export const useBlock = () => {
  return useSelector((state: State) => state.block)
}

export const useCurrentBlock = () => {
  return useSelector((state: State) => state.block.currentBlock)
}

export const useInitialBlock = () => {
  return useSelector((state: State) => state.block.initialBlock)
}
