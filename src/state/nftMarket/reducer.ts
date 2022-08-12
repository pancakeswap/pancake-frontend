import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { pancakeBunniesAddress } from 'views/Nft/market/constants'
import { getMarketDataForTokenIds, getNftsFromCollectionApi } from './helpers'
import { MarketEvent, NftActivityFilter, NftFilter, NftToken, State, NftAttribute } from './types'

const initialNftFilterState: NftFilter = {
  activeFilters: {},
  showOnlyOnSale: true,
  ordering: {
    field: 'currentAskPrice',
    direction: 'asc',
  },
}

const initialNftActivityFilterState: NftActivityFilter = {
  typeFilters: [],
  collectionFilters: [],
}

const initialState: State = {
  data: {
    nfts: {},
    filters: {},
    activityFilters: {},
    tryVideoNftMedia: true,
  },
}

/**
 * Fetch all NFT data for a collections by combining data from the API (static metadata)
 * and the Subgraph (dynamic market data)
 * @param collectionAddress
 */
export const fetchNftsFromCollections = createAsyncThunk<
  NftToken[],
  { collectionAddress: string; page: number; size: number }
>('nft/fetchNftsFromCollections', async ({ collectionAddress, page, size }) => {
  try {
    if (collectionAddress === pancakeBunniesAddress) {
      // PancakeBunnies don't need to pre-fetch "all nfts" from the collection
      // When user visits IndividualNFTPage required nfts will be fetched via bunny id
      return []
    }

    const nfts = await getNftsFromCollectionApi(collectionAddress, size, page)

    if (!nfts?.data) {
      return []
    }

    const tokenIds = Object.values(nfts.data).map((nft) => nft.tokenId)
    const nftsMarket = await getMarketDataForTokenIds(collectionAddress, tokenIds)

    return tokenIds.map((id) => {
      const apiMetadata = nfts.data[id]
      const marketData = nftsMarket.find((nft) => nft.tokenId === id)

      return {
        tokenId: id,
        name: apiMetadata.name,
        description: apiMetadata.description,
        collectionName: apiMetadata.collection.name,
        collectionAddress,
        image: apiMetadata.image,
        attributes: apiMetadata.attributes,
        marketData,
      }
    })
  } catch (error) {
    console.error(`Failed to fetch collection NFTs for ${collectionAddress}`, error)
    return []
  }
})

export const NftMarket = createSlice({
  name: 'NftMarket',
  initialState,
  reducers: {
    updateItemFilters: (
      state,
      action: PayloadAction<{ collectionAddress: string; nftFilters: Record<string, NftAttribute> }>,
    ) => {
      if (state.data.filters[action.payload.collectionAddress]) {
        state.data.filters[action.payload.collectionAddress] = {
          ...state.data.filters[action.payload.collectionAddress],
          activeFilters: { ...action.payload.nftFilters },
        }
      } else {
        state.data.filters[action.payload.collectionAddress] = {
          ...initialNftFilterState,
          activeFilters: { ...action.payload.nftFilters },
        }
      }
    },
    removeAllItemFilters: (state, action: PayloadAction<string>) => {
      if (state.data.filters[action.payload]) {
        const { ordering, showOnlyOnSale } = state.data.filters[action.payload]
        state.data.filters[action.payload] = {
          ...initialNftFilterState,
          ordering,
          showOnlyOnSale,
        }
      } else {
        state.data.filters[action.payload] = { ...initialNftFilterState }
      }
    },
    addActivityTypeFilters: (state, action: PayloadAction<{ collection: string; field: MarketEvent }>) => {
      if (state.data.activityFilters[action.payload.collection]) {
        state.data.activityFilters[action.payload.collection].typeFilters.push(action.payload.field)
      } else {
        state.data.activityFilters[action.payload.collection] = {
          ...initialNftActivityFilterState,
          typeFilters: [action.payload.field],
        }
      }
    },
    removeActivityTypeFilters: (state, action: PayloadAction<{ collection: string; field: MarketEvent }>) => {
      if (state.data.activityFilters[action.payload.collection]) {
        state.data.activityFilters[action.payload.collection].typeFilters = state.data.activityFilters[
          action.payload.collection
        ].typeFilters.filter((activeFilter) => activeFilter !== action.payload.field)
      }
    },
    addActivityCollectionFilters: (state, action: PayloadAction<{ collection: string }>) => {
      if (state.data.activityFilters['']) {
        state.data.activityFilters[''].collectionFilters.push(action.payload.collection)
      } else {
        state.data.activityFilters[''] = {
          ...initialNftActivityFilterState,
          collectionFilters: [action.payload.collection],
        }
      }
    },
    removeActivityCollectionFilters: (state, action: PayloadAction<{ collection: string }>) => {
      if (state.data.activityFilters['']) {
        state.data.activityFilters[''].collectionFilters = state.data.activityFilters[''].collectionFilters.filter(
          (activeFilter) => activeFilter !== action.payload.collection,
        )
      }
    },
    removeAllActivityCollectionFilters: (state) => {
      if (state.data.activityFilters['']) {
        state.data.activityFilters[''].collectionFilters = []
      }
    },
    removeAllActivityFilters: (state, action: PayloadAction<string>) => {
      state.data.activityFilters[action.payload] = { ...initialNftActivityFilterState }
    },
    setOrdering: (state, action: PayloadAction<{ collection: string; field: string; direction: 'asc' | 'desc' }>) => {
      if (state.data.filters[action.payload.collection]) {
        state.data.filters[action.payload.collection].ordering = {
          field: action.payload.field,
          direction: action.payload.direction,
        }
      } else {
        state.data.filters[action.payload.collection] = {
          ...initialNftFilterState,
          ordering: {
            field: action.payload.field,
            direction: action.payload.direction,
          },
        }
      }
    },
    setShowOnlyOnSale: (state, action: PayloadAction<{ collection: string; showOnlyOnSale: boolean }>) => {
      if (state.data.filters[action.payload.collection]) {
        state.data.filters[action.payload.collection].showOnlyOnSale = action.payload.showOnlyOnSale
      } else {
        state.data.filters[action.payload.collection] = {
          ...initialNftFilterState,
          showOnlyOnSale: action.payload.showOnlyOnSale,
        }
      }
    },
    setTryVideoNftMedia: (state, action: PayloadAction<boolean>) => {
      state.data.tryVideoNftMedia = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNftsFromCollections.fulfilled, (state, action) => {
      const { collectionAddress } = action.meta.arg
      const existingNfts: NftToken[] = state.data.nfts[collectionAddress] ?? []
      const existingNftsWithoutNewOnes = existingNfts.filter(
        (nftToken) => !action.payload.find((newToken) => newToken.tokenId === nftToken.tokenId),
      )

      state.data.nfts[collectionAddress] = [...existingNftsWithoutNewOnes, ...action.payload]
    })
  },
})

// Actions
export const {
  updateItemFilters,
  removeAllItemFilters,
  removeAllActivityFilters,
  removeActivityTypeFilters,
  removeActivityCollectionFilters,
  removeAllActivityCollectionFilters,
  addActivityTypeFilters,
  addActivityCollectionFilters,
  setOrdering,
  setShowOnlyOnSale,
  setTryVideoNftMedia,
} = NftMarket.actions

export default NftMarket.reducer
