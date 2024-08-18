import { TFetchStatus } from 'config/constants/types'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import useSelector from 'contexts/LocalRedux/useSelector'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useEffect, useMemo } from 'react'
import { safeGetAddress } from 'utils'
import { Address } from 'viem'

import { fetchAddressResult } from '.'
import { PredictionsState, PredictionUser } from '../types'
import {
  getCurrentRoundCloseTimestampSelector,
  getIntervalTimeInMinutes,
  getMinBetAmountSelector,
  getRoundsByCloseOracleIdSelector,
  getSortedRoundsCurrentEpochSelector,
  getSortedRoundsSelector,
  makeGetBetByEpochSelector,
  makeGetIsClaimableSelector,
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

export const useGetBetByEpoch = (account: Address, epoch: number) => {
  const getBetByEpochSelector = useMemo(() => makeGetBetByEpochSelector(account, epoch), [account, epoch])
  return useSelector(getBetByEpochSelector)
}

export const useGetIsClaimable = (epoch) => {
  const getIsClaimableSelector = useMemo(() => makeGetIsClaimableSelector(epoch), [epoch])
  return useSelector(getIsClaimableSelector)
}

export const useIsHistoryPaneOpen = () => {
  return useSelector((state: PredictionsState) => state.isHistoryPaneOpen)
}

export const useIsChartPaneOpen = () => {
  return useSelector((state: PredictionsState) => state.isChartPaneOpen)
}

export const useChartView = () => {
  return useSelector((state: PredictionsState) => state.chartView)
}

export const useGetCurrentEpoch = () => {
  return useSelector((state: PredictionsState) => state.currentEpoch)
}

export const useGetIntervalSeconds = () => {
  return useSelector((state: PredictionsState) => state.intervalSeconds)
}

export const useGetPredictionsStatus = () => {
  return useSelector((state: PredictionsState) => state.status)
}

export const useGetHistoryFilter = () => {
  return useSelector((state: PredictionsState) => state.historyFilter)
}

export const useGetHasHistoryLoaded = () => {
  return useSelector((state: PredictionsState) => state.hasHistoryLoaded)
}

export const useGetCurrentHistoryPage = () => {
  return useSelector((state: PredictionsState) => state.currentHistoryPage)
}

export const useGetMinBetAmount = () => {
  return useSelector(getMinBetAmountSelector)
}

export const useGetBufferSeconds = () => {
  return useSelector((state: PredictionsState) => state.bufferSeconds)
}

export const useGetIsFetchingHistory = () => {
  return useSelector((state: PredictionsState) => state.isFetchingHistory)
}

export const useGetHistory = () => {
  return useSelector((state: PredictionsState) => state.history)
}

/**
 * The current round's lock timestamp will not be set immediately so we return an estimate until then
 */
export const useGetCurrentRoundCloseTimestamp = () => {
  return useSelector(getCurrentRoundCloseTimestampSelector)
}

// Leaderboard
export const useGetLeaderboardLoadingState = (): TFetchStatus => {
  return useSelector((state: PredictionsState) => state.leaderboard.loadingState)
}

export const useGetLeaderboardResults = () => {
  return useSelector((state: PredictionsState) => state.leaderboard.results)
}

export const useGetLeaderboardFilters = () => {
  return useSelector((state: PredictionsState) => state.leaderboard.filters)
}

export const useGetLeaderboardSkip = () => {
  return useSelector((state: PredictionsState) => state.leaderboard.skip)
}

export const useGetLeaderboardHasMoreResults = () => {
  return useSelector((state: PredictionsState) => state.leaderboard.hasMoreResults)
}

export const useGetAddressResult = (account: string) => {
  return useSelector((state: PredictionsState) => state.leaderboard.addressResults[account])
}

export const useGetOrFetchLeaderboardAddressResult = ({
  account,
  api,
  tokenSymbol,
}: {
  account: string
  api: string
  tokenSymbol: string
}): PredictionUser | any => {
  const addressResult = useGetAddressResult(account)
  const dispatch = useLocalDispatch()
  const { chainId } = useActiveChainId()

  useEffect(() => {
    if (account) {
      const address = safeGetAddress(account)

      // If address result is null it means we already tried fetching the results and none came back
      if (!addressResult && addressResult !== null && address) {
        dispatch(fetchAddressResult({ account, api, tokenSymbol, chainId }))
      }
    }
  }, [dispatch, account, addressResult, api, tokenSymbol, chainId])

  return addressResult
}

export const useGetSelectedAddress = (): string | any => {
  return useSelector((state: PredictionsState) => state.leaderboard.selectedAddress)
}

// Because Modal Component is rendered outside the Prediction Page contexts
// We have to pass local state as props instead of retrieving directly in component
export const useStatModalProps = ({
  account,
  api,
  tokenSymbol,
}: {
  account?: string
  api: string
  tokenSymbol: string
}) => {
  const selectedAddress = useGetSelectedAddress()
  const address = account || selectedAddress
  const result = useGetOrFetchLeaderboardAddressResult({
    account: address ?? '',
    api,
    tokenSymbol,
  })
  const leaderboardLoadingState = useGetLeaderboardLoadingState()

  return {
    address,
    result,
    leaderboardLoadingState,
  }
}

export const useCollectWinningModalProps = () => {
  const isLoadingHistory = useGetIsFetchingHistory()
  const history = useGetHistory()

  return {
    isLoadingHistory,
    history,
  }
}

export const useGetIntervalTimeInMinutes = () => {
  return useSelector(getIntervalTimeInMinutes)
}
