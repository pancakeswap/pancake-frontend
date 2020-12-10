/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import farmsConfig from 'sushi/lib/constants/farms'
import fetchLps from './fetch'
import { FarmsState, FarmLP } from '../types'

const initialState: FarmsState = { data: [...farmsConfig] }

export const farmsSlice = createSlice({
  name: 'Farms',
  initialState,
  reducers: {
    updateFarmPublicData: (state, action) => {
      const liveFarmsData: FarmLP[] = action.payload
      state.data = state.data.map((farm) => {
        const liveFarmData = liveFarmsData.find((f) => f.pid === farm.pid)
        return { ...farm, ...liveFarmData }
      })
    },
  },
})

// Actions
export const { updateFarmPublicData } = farmsSlice.actions

// Thunks
export const updateFarmPublicDataAsync = () => async (dispatch) => {
  const farms = await fetchLps()
  dispatch(updateFarmPublicData(farms))
}

export default farmsSlice.reducer
