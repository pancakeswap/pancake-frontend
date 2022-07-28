import { useEffect, useMemo } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useSelector, batch } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import { State } from '../types'
import { fetchCurrentLotteryId, fetchCurrentLottery, fetchUserTicketsAndLotteries, fetchPublicLotteries } from '.'
import { makeLotteryGraphDataByIdSelector, lotterySelector } from './selectors'

// Lottery
export const useGetCurrentLotteryId = () => {
  return useSelector((state: State) => state.lottery.currentLotteryId)
}

export const useGetUserLotteriesGraphData = () => {
  return useSelector((state: State) => state.lottery.userLotteryData)
}

export const useGetLotteriesGraphData = () => {
  return useSelector((state: State) => state.lottery.lotteriesData)
}

export const useGetLotteryGraphDataById = (lotteryId: string) => {
  const lotteryGraphDataByIdSelector = useMemo(() => makeLotteryGraphDataByIdSelector(lotteryId), [lotteryId])
  return useSelector(lotteryGraphDataByIdSelector)
}

export const useFetchLottery = (fetchPublicDataOnly = false) => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const currentLotteryId = useGetCurrentLotteryId()

  useEffect(() => {
    // get current lottery ID & max ticket buy
    dispatch(fetchCurrentLotteryId())
  }, [dispatch])

  useFastRefreshEffect(() => {
    if (currentLotteryId) {
      batch(() => {
        // Get historical lottery data from nodes +  last 100 subgraph entries
        dispatch(fetchPublicLotteries({ currentLotteryId }))
        // get public data for current lottery
        dispatch(fetchCurrentLottery({ currentLotteryId }))
      })
    }
  }, [dispatch, currentLotteryId])

  useEffect(() => {
    // get user tickets for current lottery, and user lottery subgraph data
    if (account && currentLotteryId && !fetchPublicDataOnly) {
      dispatch(fetchUserTicketsAndLotteries({ account, currentLotteryId }))
    }
  }, [dispatch, currentLotteryId, account, fetchPublicDataOnly])
}

export const useLottery = () => {
  return useSelector(lotterySelector)
}
