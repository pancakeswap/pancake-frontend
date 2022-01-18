import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import useSWR from 'swr'
import { simpleRpcProvider } from 'utils/providers'
import { setBlock, setSlowCurrentBlock } from '.'
import { State } from '../types'

export const usePollBlockNumber = () => {
  const dispatch = useAppDispatch()

  useSWR(
    [FAST_INTERVAL, 'blockNumber'],
    async () => {
      const blockNumber = await simpleRpcProvider.getBlockNumber()
      dispatch(setBlock(blockNumber))
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )

  useSWR(
    [SLOW_INTERVAL, 'blockNumber'],
    async () => {
      const blockNumber = await simpleRpcProvider.getBlockNumber()
      dispatch(setSlowCurrentBlock(blockNumber))
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )
}

export const useBlock = () => {
  return useSelector((state: State) => state.block)
}
export const useSlowCurrentBlock = () => {
  return useSelector((state: State) => state.block.slowCurrentBlock)
}

export const useCurrentBlock = () => {
  return useSelector((state: State) => state.block.currentBlock)
}

export const useInitialBlock = () => {
  return useSelector((state: State) => state.block.initialBlock)
}
