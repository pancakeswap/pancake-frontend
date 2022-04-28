import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { isAddress } from 'utils'
import { useAppDispatch } from 'state'
import { State } from '../types'
import { fetchAddressResult } from '.'
import {
  getRoundsByCloseOracleIdSelector,
  getSortedRoundsSelector,
  makeGetBetByEpochSelector,
  makeGetIsClaimableSelector,
  getMinBetAmountSelector,
  getSortedRoundsCurrentEpochSelector,
  getCurrentRoundCloseTimestampSelector,
} from './selectors'

export const useGetRoundsByCloseOracleId = () => {
  return useSelector(getRoundsByCloseOracleIdSelector)
}

export const useGetSortedRounds = () => {
  return useSelector(getSortedRoundsSelector)
}

export const useGetSortedRoundsCurrentEpoch = () => {
  return useSelector(getSortedRoundsCurrentEpochSelector)
}

export const useGetBetByEpoch = (account: string, epoch: number) => {
  const getBetByEpochSelector = useMemo(() => makeGetBetByEpochSelector(account, epoch), [account, epoch])
  return useSelector(getBetByEpochSelector)
}

export const useGetIsClaimable = (epoch) => {
  const getIsClaimableSelector = useMemo(() => makeGetIsClaimableSelector(epoch), [epoch])
  return useSelector(getIsClaimableSelector)
}

export const useIsHistoryPaneOpen = () => {
  return useSelector((state: State) => state.predictions.isHistoryPaneOpen)
}

export const useIsChartPaneOpen = () => {
  return useSelector((state: State) => state.predictions.isChartPaneOpen)
}

export const useChartView = () => {
  return useSelector((state: State) => state.predictions.chartView)
}

export const useGetCurrentEpoch = () => {
  return useSelector((state: State) => state.predictions.currentEpoch)
}

export const useGetIntervalSeconds = () => {
  return useSelector((state: State) => state.predictions.intervalSeconds)
}

export const useGetPredictionsStatus = () => {
  return useSelector((state: State) => state.predictions.status)
}

export const useGetHistoryFilter = () => {
  return useSelector((state: State) => state.predictions.historyFilter)
}

export const useGetHasHistoryLoaded = () => {
  return useSelector((state: State) => state.predictions.hasHistoryLoaded)
}

export const useGetCurrentHistoryPage = () => {
  return useSelector((state: State) => state.predictions.currentHistoryPage)
}

export const useGetMinBetAmount = () => {
  return useSelector(getMinBetAmountSelector)
}

export const useGetBufferSeconds = () => {
  return useSelector((state: State) => state.predictions.bufferSeconds)
}

export const useGetIsFetchingHistory = () => {
  return useSelector((state: State) => state.predictions.isFetchingHistory)
}

export const useGetHistory = () => {
  return useSelector((state: State) => state.predictions.history)
}

/**
 * The current round's lock timestamp will not be set immediately so we return an estimate until then
 */
export const useGetCurrentRoundCloseTimestamp = () => {
  return useSelector(getCurrentRoundCloseTimestampSelector)
}

// Leaderboard
export const useGetLeaderboardLoadingState = () => {
  return useSelector((state: State) => state.predictions.leaderboard.loadingState)
}

export const useGetLeaderboardResults = () => {
  return useSelector((state: State) => state.predictions.leaderboard.results)
}

export const useGetLeaderboardFilters = () => {
  return useSelector((state: State) => state.predictions.leaderboard.filters)
}

export const useGetLeaderboardSkip = () => {
  return useSelector((state: State) => state.predictions.leaderboard.skip)
}

export const useGetLeaderboardHasMoreResults = () => {
  return useSelector((state: State) => state.predictions.leaderboard.hasMoreResults)
}

export const useGetAddressResult = (account: string) => {
  return useSelector((state: State) => state.predictions.leaderboard.addressResults[account])
}

export const useGetOrFetchLeaderboardAddressResult = (account: string) => {
  const addressResult = useGetAddressResult(account)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const address = isAddress(account)

    // If address result is null it means we already tried fetching the results and none came back
    if (!addressResult && addressResult !== null && address) {
      dispatch(fetchAddressResult(account))
    }
  }, [dispatch, account, addressResult])

  return addressResult
}

export const useGetSelectedAddress = () => {
  return useSelector((state: State) => state.predictions.leaderboard.selectedAddress)
}
