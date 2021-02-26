/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PriceApiResponse, PriceState } from 'state/types'

const initialState: PriceState = {
  isLoading: false,
  lastUpdated: null,
  data: null,
}

// Thunks
export const fetchPrices = createAsyncThunk<PriceApiResponse>('prices/fetch', async () => {
  const response = await fetch('https://api.pancakeswap.com/api/v1/price')
  const data = (await response.json()) as PriceApiResponse

  // Return normalized token names
  return {
    update_at: data.update_at,
    prices: Object.keys(data.prices).reduce((accum, token) => {
      return {
        ...accum,
        [token.toLowerCase()]: data.prices[token],
      }
    }, {}),
  }
})

export const pricesSlice = createSlice({
  name: 'prices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPrices.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchPrices.fulfilled, (state, action: PayloadAction<PriceApiResponse>) => {
      state.isLoading = false
      state.lastUpdated = action.payload.update_at
      state.data = action.payload.prices
    })
  },
})

export default pricesSlice.reducer
