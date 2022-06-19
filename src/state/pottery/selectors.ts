import { createSelector } from '@reduxjs/toolkit'
import { State } from 'state/types'
import { transformPotteryPublicData, transformPotteryUserData } from './helpers'

const selectPotteryPublicData = (state: State) => state.pottery.publicData
const selectPotteryUserData = (state: State) => state.pottery.userData

export const potterDataSelector = createSelector(
  [selectPotteryPublicData, selectPotteryUserData],
  (publicData, userData) => {
    return {
      publicData: transformPotteryPublicData(publicData),
      userData: transformPotteryUserData(userData),
    }
  },
)
