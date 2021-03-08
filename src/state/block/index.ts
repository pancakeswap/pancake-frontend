import { createSlice } from '@reduxjs/toolkit'
import { Block } from '../types'

const initialState: Block = { blockNumber: 0 }

export const blockSlice = createSlice({
  name: 'Block',
  initialState,
  reducers: {
    setBlock: (_, action) => ({ blockNumber: action.payload }),
  },
})

// Actions
export const { setBlock } = blockSlice.actions

export default blockSlice.reducer
