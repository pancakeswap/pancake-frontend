import { createSlice } from '@reduxjs/toolkit'
import { LastBlock } from '../types'

const initialState: LastBlock = { blockNumber: 0, timestamp: 0 }

export const lastBlockSlice = createSlice({
  name: 'LastBlock',
  initialState,
  reducers: {
    setlastBlock: (_, action) => ({ blockNumber: action.payload.number, timestamp: action.payload.timestamp }),
  },
})

// Actions
export const { setlastBlock } = lastBlockSlice.actions

export default lastBlockSlice.reducer
