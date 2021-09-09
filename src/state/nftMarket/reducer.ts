import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getCollections, getNftsFromCollection } from './helpers'
import { State, Collection, NFT } from './types'

const initialState: State = {
  data: {
    collections: {},
    nfts: {},
    users: {},
  },
}

export const fetchCollections = createAsyncThunk<{ [key: string]: Collection }>('nft/fetchCollections', async () => {
  const collections = await getCollections()
  return collections.reduce((prev, current) => ({ ...prev, [current.id]: { ...current, nfts: [] } }), {})
})

export const fetchNftsFromCollections = createAsyncThunk<NFT[], string>(
  'nft/fetchNftsFromCollections',
  async (collectionAddress) => {
    const nfts = await getNftsFromCollection(collectionAddress)
    return nfts
  },
)

export const NftMarket = createSlice({
  name: 'NftMarket',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCollections.fulfilled, (state, action) => {
      state.data.collections = action.payload
    })
    builder.addCase(fetchNftsFromCollections.fulfilled, (state, action) => {
      state.data.nfts[action.meta.arg] = action.payload
    })
  },
})

export default NftMarket.reducer
