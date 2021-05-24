/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PriceApiResponse, PriceApiThunk, PriceApiState } from 'state/types'

const initialState: PriceApiState = {
  isLoading: false,
  lastUpdated: null,
  data: null,
}

// Thunks
export const fetchApiPrices = createAsyncThunk<PriceApiThunk>('apiPrices/fetch', async () => {
  const response = await fetch('https://api.pancakeswap.info/api/v2/tokens')
  const data = (await response.json()) as PriceApiResponse

  // Return normalized token names
  return {
    updated_at: data.updated_at,
    data: Object.keys(data.data).reduce((accum, token) => {
      return {
        ...accum,
        [token.toLowerCase()]: parseFloat(data.data[token].price),
      }
    }, {}),
  }
})

export const apiPricesSlice = createSlice({
  name: 'apiPrices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchApiPrices.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchApiPrices.fulfilled, (state, action: PayloadAction<PriceApiThunk>) => {
      state.isLoading = false
      state.lastUpdated = action.payload.updated_at
      state.data = action.payload.data
    })
  },
})

export default apiPricesSlice.reducer
