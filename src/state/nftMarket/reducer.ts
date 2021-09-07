import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getCollections } from './helpers'
import { State, Collection } from './types'

const initialState: State = {
  data: {
    collections: [],
    users: [],
  },
}

export const fetchCollections = createAsyncThunk<Collection[]>('nft/fetchFarmsPublicDataAsync', async () => {
  const collections = await getCollections()
  return collections
})

export const NftMarket = createSlice({
  name: 'NftMarket',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCollections.fulfilled, (state, action) => {
      state.data.collections = action.payload
    })
  },
})

export default NftMarket.reducer
