/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TokenPair, TickerStream, TickerState } from 'state/types'

const initialState: TickerState = {
  data: {
    [TokenPair.BNBUSDT]: {
      isConnected: false,
    },
  },
}

export const tickerSlice = createSlice({
  name: 'ticker',
  initialState,
  reducers: {
    setTokenPair: (state, action: PayloadAction<{ tokenPair: TokenPair; data: TickerStream }>) => {
      const { tokenPair, data } = action.payload
      state.data[tokenPair].data = data
    },
    setConnectedStatus: (state, action: PayloadAction<{ tokenPair: TokenPair; status: boolean }>) => {
      const { tokenPair, status } = action.payload
      state.data[tokenPair].isConnected = status
    },
  },
})

// Actions
export const { setTokenPair, setConnectedStatus } = tickerSlice.actions

export default tickerSlice.reducer
