/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import poolsConfig from 'sushi/lib/constants/pools'
import fetchPools from './fetch'
import { PoolsState, Pool } from '../types'

const initialState: PoolsState = { data: [...poolsConfig] }

export const PoolsSlice = createSlice({
  name: 'Pools',
  initialState,
  reducers: {
    updatePoolPublicData: (state, action) => {
      const livePoolsData: Pool[] = action.payload
      state.data = state.data.map((pool) => {
        const livePoolData = livePoolsData.find((p) => p.sousId === pool.sousId)
        return { ...pool, ...livePoolData }
      })
    },
  },
})

// Actions
export const { updatePoolPublicData } = PoolsSlice.actions

// Thunks
export const updatePoolPublicDataAsync = () => async (dispatch) => {
  const pools = await fetchPools()
  dispatch(updatePoolPublicData(pools))
}

export default PoolsSlice.reducer
