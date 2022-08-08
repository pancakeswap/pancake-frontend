import { createSelector } from '@reduxjs/toolkit'
import { State } from 'state/types'
import { transformPotteryPublicData, transformPotteryUserData } from './helpers'

const selectPotteryPublicData = (state: State) => state.pottery.publicData
const selectPotteryUserData = (state: State) => state.pottery.userData
const selectfinishedRoundInfoData = (state: State) => state.pottery.finishedRoundInfo

export const potterDataSelector = createSelector(
  [selectPotteryPublicData, selectPotteryUserData, selectfinishedRoundInfoData],
  (publicData, userData, finishedRoundInfo) => {
    return {
      publicData: transformPotteryPublicData(publicData),
      userData: transformPotteryUserData(userData),
      finishedRoundInfo,
    }
  },
)
