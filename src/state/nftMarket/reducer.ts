import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getCollectionsApi, getCollectionsSg, getNftsMetadata, getNftsMarketData } from './helpers'
import { State, Collection, NFT } from './types'

const initialState: State = {
  isInitializing: true,
  data: {
    collections: {},
    nfts: {},
    users: {},
  },
}

export const fetchCollections = createAsyncThunk<{ [key: string]: Collection }>('nft/fetchCollections', async () => {
  const collections = await getCollectionsApi()
  const collectionsMarket = await getCollectionsSg()
  const collectionsMarketObj = collectionsMarket.reduce(
    (prev, current) => ({ ...prev, [current.id]: { ...current } }),
    {},
  )

  return collections.reduce((prev, current) => {
    const collectionMarket = collectionsMarketObj[current.address]
    return {
      ...prev,
      [current.address]: {
        ...current,
        active: collectionMarket.active,
        totalVolumeBNB: collectionMarket.totalVolumeBNB,
        numberTokensListed: collectionMarket.numberTokensListed,
        tradingFee: collectionMarket.tradingFee,
        creatorFee: collectionMarket.creatorFee,
      },
    }
  }, {})
})

export const fetchNftsFromCollections = createAsyncThunk<NFT[], string>(
  'nft/fetchNftsFromCollections',
  async (collectionAddress) => {
    const nftsMeta = await getNftsMetadata(collectionAddress)
    const nftsMarket = await getNftsMarketData(collectionAddress)
    const nfts = nftsMarket.map((matchingMarketData) => {
      const meta = nftsMeta.find((market) => market.tokenId === meta.id)
      return { ...matchingMarketData, ...meta }
    })

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
      state.isInitializing = false
    })
    builder.addCase(fetchNftsFromCollections.fulfilled, (state, action) => {
      state.data.nfts[action.meta.arg] = action.payload
    })
  },
})

export default NftMarket.reducer
