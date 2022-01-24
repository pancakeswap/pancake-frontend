import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FetchStatus } from 'config/constants/types'
import isEmpty from 'lodash/isEmpty'
import { pancakeBunniesAddress } from 'views/Nft/market/constants'
import { multicallv2 } from 'utils/multicall'
import erc721Abi from 'config/abi/erc721.json'
import {
  combineApiAndSgResponseToNftToken,
  combineCollectionData,
  fetchNftsFiltered,
  getCollectionApi,
  getCollectionsApi,
  getCollectionSg,
  getCollectionsSg,
  getMarketDataForTokenIds,
  getMetadataWithFallback,
  getNftsByBunnyIdSg,
  getNftsFromCollectionApi,
  getNftsMarketData,
  getPancakeBunniesAttributesField,
} from './helpers'
import {
  ApiCollection,
  ApiSingleTokenData,
  Collection,
  MarketEvent,
  NftActivityFilter,
  NftAttribute,
  NftFilter,
  NFTMarketInitializationState,
  NftToken,
  State,
} from './types'

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
  initializationState: NFTMarketInitializationState.UNINITIALIZED,
  data: {
    collections: {},
    nfts: {},
    filters: {},
    activityFilters: {},
    loadingState: {
      isUpdatingPancakeBunnies: false,
      latestPancakeBunniesUpdateAt: 0,
    },
  },
}

const fetchCollectionsTotalSupply = async (collections: ApiCollection[]): Promise<number[]> => {
  const totalSupplyCalls = collections.map((collection) => ({
    address: collection.address.toLowerCase(),
    name: 'totalSupply',
  }))
  if (totalSupplyCalls.length > 0) {
    const totalSupplyRaw = await multicallv2(erc721Abi, totalSupplyCalls, { requireSuccess: false })
    const totalSupply = totalSupplyRaw.flat()
    return totalSupply.map((totalCount) => (totalCount ? totalCount.toNumber() : 0))
  }
  return []
}

/**
 * Fetch all collections data by combining data from the API (static metadata) and the Subgraph (dynamic market data)
 */
export const fetchCollections = createAsyncThunk<Record<string, Collection>>('nft/fetchCollections', async () => {
  const [collections, collectionsMarket] = await Promise.all([getCollectionsApi(), getCollectionsSg()])
  const collectionApiData: ApiCollection[] = collections?.data ?? []
  const collectionsTotalSupply = await fetchCollectionsTotalSupply(collectionApiData)
  const collectionApiDataCombinedOnChain = collectionApiData.map((collection, index) => {
    const totalSupplyFromApi = Number(collection.totalSupply) || 0
    const totalSupplyFromOnChain = collectionsTotalSupply[index]
    return {
      ...collection,
      totalSupply: Math.max(totalSupplyFromApi, totalSupplyFromOnChain).toString(),
    }
  })

  return combineCollectionData(collectionApiDataCombinedOnChain, collectionsMarket)
})

/**
 * Fetch collection data by combining data from the API (static metadata) and the Subgraph (dynamic market data)
 */
export const fetchCollection = createAsyncThunk<Record<string, Collection>, string>(
  'nft/fetchCollection',
  async (collectionAddress) => {
    const [collection, collectionMarket] = await Promise.all([
      getCollectionApi(collectionAddress),
      getCollectionSg(collectionAddress),
    ])

    const collectionsTotalSupply = await fetchCollectionsTotalSupply([collection])
    const totalSupplyFromApi = Number(collection.totalSupply) || 0
    const totalSupplyFromOnChain = collectionsTotalSupply[0]
    const collectionApiDataCombinedOnChain = {
      ...collection,
      totalSupply: Math.max(totalSupplyFromApi, totalSupplyFromOnChain).toString(),
    }

    return combineCollectionData([collectionApiDataCombinedOnChain], [collectionMarket])
  },
)

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

/**
 * This action keeps data on the individual PancakeBunny page up-to-date. Operation is a twofold
 * 1. Update existing NFTs in the state in case some were sold or got price modified
 * 2. Fetch 30 more NFTs with specified bunny id
 */
export const fetchNewPBAndUpdateExisting = createAsyncThunk<
  NftToken[],
  {
    bunnyId: string
    existingTokensWithBunnyId: string[]
    allExistingPBTokenIds: string[]
    existingMetadata: ApiSingleTokenData
    orderDirection: 'asc' | 'desc'
  }
>(
  'nft/fetchNewPBAndUpdateExisting',
  async ({ bunnyId, existingTokensWithBunnyId, allExistingPBTokenIds, existingMetadata, orderDirection }) => {
    try {
      // 1. Update existing NFTs in the state in case some were sold or got price modified
      const [updatedNfts, updatedNftsMarket] = await Promise.all([
        getNftsFromCollectionApi(pancakeBunniesAddress),
        getMarketDataForTokenIds(pancakeBunniesAddress, allExistingPBTokenIds),
      ])

      if (!updatedNfts?.data) {
        return []
      }
      const updatedTokens = updatedNftsMarket.map((marketData) => {
        const apiMetadata = getMetadataWithFallback(updatedNfts.data, marketData.otherId)
        const attributes = getPancakeBunniesAttributesField(marketData.otherId)
        return combineApiAndSgResponseToNftToken(apiMetadata, marketData, attributes)
      })

      // 2. Fetch 30 more NFTs with specified bunny id
      let newNfts = { data: { [bunnyId]: existingMetadata } }

      if (!existingMetadata) {
        newNfts = await getNftsFromCollectionApi(pancakeBunniesAddress)
      }
      const nftsMarket = await getNftsByBunnyIdSg(bunnyId, existingTokensWithBunnyId, orderDirection)

      if (!newNfts?.data) {
        return updatedTokens
      }

      const moreTokensWithRequestedBunnyId = nftsMarket.map((marketData) => {
        const apiMetadata = getMetadataWithFallback(newNfts.data, marketData.otherId)
        const attributes = getPancakeBunniesAttributesField(marketData.otherId)
        return combineApiAndSgResponseToNftToken(apiMetadata, marketData, attributes)
      })
      return [...updatedTokens, ...moreTokensWithRequestedBunnyId]
    } catch (error) {
      console.error(`Failed to update PancakeBunnies NFTs`, error)
      return []
    }
  },
)

export const NftMarket = createSlice({
  name: 'NftMarket',
  initialState,
  reducers: {
    removeAllFilters: (state, action: PayloadAction<string>) => {
      state.data.filters[action.payload] = { ...initialNftFilterState }
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

    builder.addCase(fetchCollection.fulfilled, (state, action) => {
      state.data.collections = { ...state.data.collections, ...action.payload }
    })
    builder.addCase(fetchCollections.fulfilled, (state, action) => {
      state.data.collections = action.payload
      state.initializationState = NFTMarketInitializationState.INITIALIZED
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
    builder.addCase(fetchNewPBAndUpdateExisting.pending, (state) => {
      state.data.loadingState.isUpdatingPancakeBunnies = true
    })
    builder.addCase(fetchNewPBAndUpdateExisting.fulfilled, (state, action) => {
      if (action.payload.length > 0) {
        state.data.nfts[pancakeBunniesAddress] = action.payload
      }
      state.data.loadingState.isUpdatingPancakeBunnies = false
      state.data.loadingState.latestPancakeBunniesUpdateAt = Date.now()
    })
    builder.addCase(fetchNewPBAndUpdateExisting.rejected, (state) => {
      state.data.loadingState.isUpdatingPancakeBunnies = false
      state.data.loadingState.latestPancakeBunniesUpdateAt = Date.now()
    })
  },
})

// Actions
export const {
  removeAllFilters,
  removeAllActivityFilters,
  removeActivityTypeFilters,
  removeActivityCollectionFilters,
  removeAllActivityCollectionFilters,
  addActivityTypeFilters,
  addActivityCollectionFilters,
  setOrdering,
  setShowOnlyOnSale,
} = NftMarket.actions

export default NftMarket.reducer
