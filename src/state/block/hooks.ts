import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import useIsWindowVisibleRef from 'hooks/useIsWindowVisibleRef'
import { simpleRpcProvider } from 'utils/providers'
import { setBlock } from '.'
import { State } from '../types'

export const usePollBlockNumber = () => {
  const timer = useRef(null)
  const dispatch = useAppDispatch()
  const isWindowVisible = useIsWindowVisibleRef()

  useEffect(() => {
    timer.current = setInterval(async () => {
      if (isWindowVisible.current) {
        const blockNumber = await simpleRpcProvider.getBlockNumber()
        dispatch(setBlock(blockNumber))
      }
    }, 6000)

    return () => clearInterval(timer.current)
  }, [dispatch, timer, isWindowVisible])
}

export const useBlock = () => {
  return useSelector((state: State) => state.block)
}

export const useInitialBlock = () => {
  return useSelector((state: State) => state.block.initialBlock)
}
