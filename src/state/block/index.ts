import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BlockState } from '../types'

const initialState: BlockState = { currentBlock: 0, initialBlock: 0, slowCurrentBlock: 0 }

export const blockSlice = createSlice({
  name: 'Block',
  initialState,
  reducers: {
    setBlock: (state, action: PayloadAction<number>) => {
      if (state.initialBlock === 0) {
        state.initialBlock = action.payload
      }

      state.currentBlock = action.payload
    },
    setSlowCurrentBlock: (state, action: PayloadAction<number>) => {
      state.slowCurrentBlock = action.payload
    },
  },
})

// Actions
export const { setBlock, setSlowCurrentBlock } = blockSlice.actions

export default blockSlice.reducer
