import { createSelector } from '@reduxjs/toolkit'
import { State } from 'state/types'
import { transformPotteryUserData } from './helpers'

const selectCurrentPotteryId = (state: State) => state.pottery.currentPotteryId
const selectPotteryUserData = (state: State) => state.pottery.userData
const selectUserDataLoaded = (state: State) => state.pottery?.userDataLoaded

export const potterySelector = createSelector(
  [selectCurrentPotteryId, selectPotteryUserData, selectUserDataLoaded],
  (currentPotteryId, userData, userDataLoaded) => {
    return {
      currentPotteryId,
      userData: transformPotteryUserData(userData),
      userDataLoaded,
    }
  },
)
