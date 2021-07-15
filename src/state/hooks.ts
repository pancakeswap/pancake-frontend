import { useEffect, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useSelector } from 'react-redux'
import { ethers } from 'ethers'
import { minBy, orderBy } from 'lodash'
import { useAppDispatch } from 'state'
import Nfts from 'config/constants/nfts'
import { State, NodeRound, ReduxNodeLedger, NodeLedger, ReduxNodeRound } from './types'
import { fetchWalletNfts } from './collectibles'
import { parseBigNumberObj } from './predictions/helpers'

// /!\
// Don't add anything here. These hooks will be moved the the predictions folder

// Predictions
export const useGetRounds = () => {
  const rounds = useSelector((state: State) => state.predictions.rounds)
  return Object.keys(rounds).reduce((accum, epoch) => {
    return {
      ...accum,
      [epoch]: parseBigNumberObj<ReduxNodeRound, NodeRound>(rounds[epoch]),
    }
  }, {}) as { [key: string]: NodeRound }
}

export const useGetRound = (epoch: number) => {
  const round = useSelector((state: State) => state.predictions.rounds[epoch])
  return parseBigNumberObj<ReduxNodeRound, NodeRound>(round)
}

export const useGetSortedRounds = () => {
  const roundData = useGetRounds()
  return orderBy(Object.values(roundData), ['epoch'], ['asc'])
}

export const useGetBetByEpoch = (account: string, epoch: number) => {
  const bets = useSelector((state: State) => state.predictions.ledgers)

  if (!bets[account]) {
    return null
  }

  if (!bets[account][epoch]) {
    return null
  }

  return parseBigNumberObj<ReduxNodeLedger, NodeLedger>(bets[account][epoch])
}

export const useGetIsClaimable = (epoch) => {
  const claimableStatuses = useSelector((state: State) => state.predictions.claimableStatuses)
  return claimableStatuses[epoch] || false
}

/**
 * Used to get the range of rounds to poll for
 */
export const useGetEarliestEpoch = () => {
  return useSelector((state: State) => {
    const earliestRound = minBy(Object.values(state.predictions.rounds), 'epoch')
    return earliestRound?.epoch
  })
}

export const useIsHistoryPaneOpen = () => {
  return useSelector((state: State) => state.predictions.isHistoryPaneOpen)
}

export const useIsChartPaneOpen = () => {
  return useSelector((state: State) => state.predictions.isChartPaneOpen)
}

export const useGetCurrentEpoch = () => {
  return useSelector((state: State) => state.predictions.currentEpoch)
}

export const useGetIntervalBlocks = () => {
  return useSelector((state: State) => state.predictions.intervalBlocks)
}

export const useGetBufferBlocks = () => {
  return useSelector((state: State) => state.predictions.bufferBlocks)
}

export const useGetTotalIntervalBlocks = () => {
  const intervalBlocks = useGetIntervalBlocks()
  const bufferBlocks = useGetBufferBlocks()
  return intervalBlocks + bufferBlocks
}

export const useGetCurrentRound = () => {
  const currentEpoch = useGetCurrentEpoch()
  const rounds = useGetSortedRounds()
  return rounds.find((round) => round.epoch === currentEpoch)
}

export const useGetPredictionsStatus = () => {
  return useSelector((state: State) => state.predictions.status)
}

export const useGetHistoryFilter = () => {
  return useSelector((state: State) => state.predictions.historyFilter)
}

export const useGetCurrentRoundBlockNumber = () => {
  return useSelector((state: State) => state.predictions.currentRoundStartBlockNumber)
}

export const useGetMinBetAmount = () => {
  const minBetAmount = useSelector((state: State) => state.predictions.minBetAmount)
  return useMemo(() => ethers.BigNumber.from(minBetAmount), [minBetAmount])
}

export const useGetRewardRate = () => {
  const rewardRate = useSelector((state: State) => state.predictions.rewardRate)
  return rewardRate / 100
}

export const useGetIsFetchingHistory = () => {
  return useSelector((state: State) => state.predictions.isFetchingHistory)
}

export const useGetHistory = () => {
  return useSelector((state: State) => state.predictions.history)
}

export const useGetHistoryByAccount = (account: string) => {
  const bets = useGetHistory()
  return bets ? bets[account] : []
}

export const useGetLedgerByRoundId = (account: string, roundId: string) => {
  const ledgers = useSelector((state: State) => state.predictions.ledgers)

  if (!ledgers[account]) {
    return null
  }

  if (!ledgers[account][roundId]) {
    return null
  }

  return ledgers[account][roundId]
}

export const useGetLastOraclePrice = () => {
  const lastOraclePrice = useSelector((state: State) => state.predictions.lastOraclePrice)
  return useMemo(() => {
    return ethers.BigNumber.from(lastOraclePrice)
  }, [lastOraclePrice])
}

// Collectibles
export const useGetCollectibles = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { isInitialized, isLoading, data } = useSelector((state: State) => state.collectibles)
  const identifiers = Object.keys(data)

  useEffect(() => {
    // Fetch nfts only if we have not done so already
    if (!isInitialized) {
      dispatch(fetchWalletNfts(account))
    }
  }, [isInitialized, account, dispatch])

  return {
    isInitialized,
    isLoading,
    tokenIds: data,
    nftsInWallet: Nfts.filter((nft) => identifiers.includes(nft.identifier)),
  }
}
