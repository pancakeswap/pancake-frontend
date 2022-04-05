import BigNumber from 'bignumber.js'
import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectCurrentLotteryId = (state: State) => state.lottery.currentLotteryId
const selectIsTransitioning = (state: State) => state.lottery.isTransitioning
const selectCurrentRound = (state: State) => state.lottery.currentRound
const selectUserLotteryData = (state: State) => state.lottery.userLotteryData
const selectLotteriesData = (state: State) => state.lottery.lotteriesData
const selectMaxNumberTicketsPerBuyOrClaim = (state: State) => state.lottery.maxNumberTicketsPerBuyOrClaim

export const makeLotteryGraphDataByIdSelector = (lotteryId: string) =>
  createSelector([selectLotteriesData], (lotteriesData) => lotteriesData?.find((lottery) => lottery.id === lotteryId))

export const maxNumberTicketsPerBuyOrClaimSelector = createSelector(
  [selectMaxNumberTicketsPerBuyOrClaim],
  (maxNumberTicketsPerBuyOrClaimAsString) => {
    return new BigNumber(maxNumberTicketsPerBuyOrClaimAsString)
  },
)

export const currentRoundSelector = createSelector([selectCurrentRound], (currentRound) => {
  const {
    priceTicketInCake: priceTicketInCakeAsString,
    discountDivisor: discountDivisorAsString,
    amountCollectedInCake: amountCollectedInCakeAsString,
  } = currentRound

  return {
    ...currentRound,
    priceTicketInCake: new BigNumber(priceTicketInCakeAsString),
    discountDivisor: new BigNumber(discountDivisorAsString),
    amountCollectedInCake: new BigNumber(amountCollectedInCakeAsString),
  }
})

export const lotterySelector = createSelector(
  [
    currentRoundSelector,
    selectIsTransitioning,
    selectCurrentLotteryId,
    selectUserLotteryData,
    selectLotteriesData,
    maxNumberTicketsPerBuyOrClaimSelector,
  ],
  (
    processedCurrentRound,
    isTransitioning,
    currentLotteryId,
    userLotteryData,
    lotteriesData,
    maxNumberTicketsPerBuyOrClaim,
  ) => {
    return {
      currentLotteryId,
      maxNumberTicketsPerBuyOrClaim,
      isTransitioning,
      userLotteryData,
      lotteriesData,
      currentRound: processedCurrentRound,
    }
  },
)
