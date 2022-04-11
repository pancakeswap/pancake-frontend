import { BigNumber } from '@ethersproject/bignumber'
import orderBy from 'lodash/orderBy'
import { createSelector } from '@reduxjs/toolkit'
import { State, ReduxNodeRound, NodeRound, ReduxNodeLedger, NodeLedger } from '../types'
import { parseBigNumberObj } from './helpers'

const selectCurrentEpoch = (state: State) => state.predictions.currentEpoch
const selectRounds = (state: State) => state.predictions.rounds
const selectLedgers = (state: State) => state.predictions.ledgers
const selectClaimableStatuses = (state: State) => state.predictions.claimableStatuses
const selectMinBetAmount = (state: State) => state.predictions.minBetAmount
const selectIntervalSeconds = (state: State) => state.predictions.intervalSeconds

export const makeGetBetByEpochSelector = (account: string, epoch: number) =>
  createSelector([selectLedgers], (bets) => {
    if (!bets[account]) {
      return null
    }

    if (!bets[account][epoch]) {
      return null
    }

    return parseBigNumberObj<ReduxNodeLedger, NodeLedger>(bets[account][epoch])
  })

export const makeGetIsClaimableSelector = (epoch: number) =>
  createSelector([selectClaimableStatuses], (claimableStatuses) => {
    return claimableStatuses[epoch] || false
  })

export const getRoundsByCloseOracleIdSelector = createSelector([selectRounds], (rounds) => {
  return Object.keys(rounds).reduce((accum, epoch) => {
    const parsed = parseBigNumberObj<ReduxNodeRound, NodeRound>(rounds[epoch])
    return {
      ...accum,
      [parsed.closeOracleId]: parsed,
    }
  }, {}) as { [key: string]: NodeRound }
})

export const getBigNumberRounds = createSelector([selectRounds], (rounds) => {
  return Object.keys(rounds).reduce((accum, epoch) => {
    return {
      ...accum,
      [epoch]: parseBigNumberObj<ReduxNodeRound, NodeRound>(rounds[epoch]),
    }
  }, {}) as { [key: string]: NodeRound }
})

export const getSortedRoundsSelector = createSelector([getBigNumberRounds], (rounds) => {
  return orderBy(Object.values(rounds), ['epoch'], ['asc'])
})

export const getSortedRoundsCurrentEpochSelector = createSelector(
  [selectCurrentEpoch, getSortedRoundsSelector],
  (currentEpoch, sortedRounds) => {
    return {
      currentEpoch,
      rounds: sortedRounds,
    }
  },
)

export const getMinBetAmountSelector = createSelector([selectMinBetAmount], BigNumber.from)

export const getCurrentRoundLockTimestampSelector = createSelector(
  [selectCurrentEpoch, getBigNumberRounds, selectIntervalSeconds],
  (currentEpoch, rounds, intervalSeconds) => {
    const currentRound = rounds[currentEpoch]

    if (!currentRound) {
      return undefined
    }

    if (!currentRound.lockTimestamp) {
      return currentRound.startTimestamp + intervalSeconds
    }

    return currentRound.lockTimestamp
  },
)
