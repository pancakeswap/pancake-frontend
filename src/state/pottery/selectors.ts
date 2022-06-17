import { createSelector } from '@reduxjs/toolkit'
import { State } from 'state/types'
import { transformPotteryUserData } from './helpers'

// const selectCurrentPotteryId = (state: State) => state.pottery.currentPotteryId
const selectPotteryUserData = (state: State) => state.pottery.userData
const selectUserDataLoaded = (state: State) => state.pottery.userDataLoaded

export const potteryUserDataSelector = createSelector(
  [selectUserDataLoaded, selectPotteryUserData],
  (userDataLoaded, userData) => {
    return {
      userDataLoaded,
      userData: transformPotteryUserData(userData),
    }
  },
)
