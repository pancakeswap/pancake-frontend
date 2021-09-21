import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import useIsWindowVisible from 'hooks/useIsWindowVisible'
import { simpleRpcProvider } from 'utils/providers'
import { setBlock } from '.'
import { State } from '../types'

export const usePollBlockNumber = (refreshTime = 6000) => {
  const timer = useRef(null)
  const dispatch = useAppDispatch()
  const isWindowVisible = useIsWindowVisible()

  useEffect(() => {
    if (isWindowVisible) {
      timer.current = setInterval(async () => {
        const blockNumber = await simpleRpcProvider.getBlockNumber()
        dispatch(setBlock(blockNumber))
      }, refreshTime)
    } else {
      clearInterval(timer.current)
    }

    return () => clearInterval(timer.current)
  }, [dispatch, timer, isWindowVisible, refreshTime])
}

export const useBlock = () => {
  return useSelector((state: State) => state.block)
}

export const useInitialBlock = () => {
  return useSelector((state: State) => state.block.initialBlock)
}
