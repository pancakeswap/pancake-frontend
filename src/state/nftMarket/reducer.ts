import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FetchStatus } from 'config/constants/types'
import isEmpty from 'lodash/isEmpty'
import { pancakeBunniesAddress } from 'views/Nft/market/constants'
import { fetchNftsFiltered, getMarketDataForTokenIds, getNftsFromCollectionApi, getNftsMarketData } from './helpers'
import { MarketEvent, NftActivityFilter, NftAttribute, NftFilter, NftToken, State } from './types'

const initialNftFilterState: NftFilter = {
  loadingState: FetchStatus.Idle,
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

export const filterNftsFromCollection = createAsyncThunk<
  NftToken[],
  { collectionAddress: string; nftFilters: Record<string, NftAttribute> }
>('nft/filterNftsFromCollection', async ({ collectionAddress, nftFilters }) => {
  try {
    const attrParams = Object.values(nftFilters).reduce(
      (accum, attr) => ({
        ...accum,
        [attr.traitType]: attr.value,
      }),
      {},
    )
    if (isEmpty(attrParams)) {
      return []
    }
    const attrFilters = await fetchNftsFiltered(collectionAddress, attrParams)

    // Fetch market data for each token returned
    const tokenIds = Object.values(attrFilters.data).map((apiToken) => apiToken.tokenId)
    const marketData = await getNftsMarketData({ tokenId_in: tokenIds, collection: collectionAddress.toLowerCase() })

    const nftTokens: NftToken[] = Object.values(attrFilters.data).map((apiToken) => {
      const apiTokenMarketData = marketData.find((tokenMarketData) => tokenMarketData.tokenId === apiToken.tokenId)

      return {
        tokenId: apiToken.tokenId,
        name: apiToken.name,
        description: apiToken.description,
        collectionName: apiToken.collection.name,
        collectionAddress,
        image: apiToken.image,
        attributes: apiToken.attributes,
        marketData: apiTokenMarketData,
      }
    })

    return nftTokens
  } catch {
    return []
  }
})

export const NftMarket = createSlice({
  name: 'NftMarket',
  initialState,
  reducers: {
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

      state.data.nfts[action.payload] = []
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
    builder.addCase(filterNftsFromCollection.pending, (state, action) => {
      const { collectionAddress } = action.meta.arg
      if (state.data.filters[collectionAddress]) {
        state.data.filters[collectionAddress].loadingState = FetchStatus.Fetching
      } else {
        state.data.filters[collectionAddress] = {
          ...initialNftFilterState,
          loadingState: FetchStatus.Fetching,
        }
      }
    })
    builder.addCase(filterNftsFromCollection.fulfilled, (state, action) => {
      const { collectionAddress, nftFilters } = action.meta.arg

      state.data.filters[collectionAddress] = {
        ...state.data.filters[collectionAddress],
        loadingState: FetchStatus.Fetched,
        activeFilters: nftFilters,
      }
      state.data.nfts[collectionAddress] = action.payload
    })
    builder.addCase(fetchNftsFromCollections.pending, (state, action) => {
      const { collectionAddress } = action.meta.arg
      if (state.data.filters[collectionAddress]) {
        state.data.filters[collectionAddress].loadingState = FetchStatus.Fetching
      } else {
        state.data.filters[collectionAddress] = {
          ...initialNftFilterState,
          loadingState: FetchStatus.Fetching,
        }
      }
    })
    builder.addCase(fetchNftsFromCollections.fulfilled, (state, action) => {
      const { collectionAddress } = action.meta.arg
      const existingNfts: NftToken[] = state.data.nfts[collectionAddress] ?? []
      const existingNftsWithoutNewOnes = existingNfts.filter(
        (nftToken) => !action.payload.find((newToken) => newToken.tokenId === nftToken.tokenId),
      )

      state.data.filters[collectionAddress] = {
        ...state.data.filters[collectionAddress],
        loadingState: FetchStatus.Fetched,
        activeFilters: {},
      }
      state.data.nfts[collectionAddress] = [...existingNftsWithoutNewOnes, ...action.payload]
    })
  },
})

// Actions
export const {
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
