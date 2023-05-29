import orderBy from 'lodash/orderBy'
import { createSelector } from '@reduxjs/toolkit'
import { PredictionsState, NodeRound, NodeLedger } from '../types'
import { deserializeRound } from './helpers'

const selectCurrentEpoch = (state: PredictionsState) => state.currentEpoch
const selectRounds = (state: PredictionsState) => state.rounds
const selectLedgers = (state: PredictionsState) => state.ledgers
const selectClaimableStatuses = (state: PredictionsState) => state.claimableStatuses
const selectMinBetAmount = (state: PredictionsState) => state.minBetAmount
const selectIntervalSeconds = (state: PredictionsState) => state.intervalSeconds

export const makeGetBetByEpochSelector = (account: string, epoch: number) =>
  createSelector([selectLedgers], (bets): NodeLedger => {
    if (!bets[account]) {
      return null
    }

    if (!bets[account][epoch]) {
      return null
    }

    return {
      amount: BigInt(bets[account][epoch].amount),
      claimed: bets[account][epoch].claimed,
      position: bets[account][epoch].position,
    }
  })

export const makeGetIsClaimableSelector = (epoch: number) =>
  createSelector([selectClaimableStatuses], (claimableStatuses) => {
    return claimableStatuses[epoch] || false
  })

export const getRoundsByCloseOracleIdSelector = createSelector([selectRounds], (rounds) => {
  return Object.keys(rounds).reduce((accum, epoch) => {
    const parsed = deserializeRound(rounds[epoch])
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
      [epoch]: deserializeRound(rounds[epoch]),
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

export const getMinBetAmountSelector = createSelector([selectMinBetAmount], (b) => BigInt(b))

export const getCurrentRoundCloseTimestampSelector = createSelector(
  [selectCurrentEpoch, getBigNumberRounds, selectIntervalSeconds],
  (currentEpoch, rounds, intervalSeconds) => {
    if (!currentEpoch) {
      return undefined
    }

    const currentRound = rounds[currentEpoch - 1]

    if (!currentRound) {
      return undefined
    }

    if (!currentRound.closeTimestamp) {
      return currentRound.lockTimestamp + intervalSeconds
    }
    return currentRound.closeTimestamp
  },
)
