import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { pancakeBunniesAddress } from 'views/Nft/market/constants'
import {
  getNftsFromCollectionApi,
  getNftsFromCollectionSg,
  getNftsMarketData,
  getCollectionsApi,
  getCollectionsSg,
  getUserActivity,
  combineCollectionData,
  getCollectionSg,
  getCollectionApi,
  getNftsFromDifferentCollectionsApi,
  getCompleteAccountNftData,
  getNftsByBunnyIdSg,
  getMarketDataForTokenIds,
  getMetadataWithFallback,
  getPancakeBunniesAttributesField,
  combineApiAndSgResponseToNftToken,
  fetchNftsFiltered,
} from './helpers'
import {
  State,
  Collection,
  ApiCollections,
  TokenIdWithCollectionAddress,
  NFTMarketInitializationState,
  UserNftInitializationState,
  NftToken,
  NftLocation,
  ApiSingleTokenData,
  NftFilter,
  NftAttribute,
} from './types'

const initialState: State = {
  initializationState: NFTMarketInitializationState.UNINITIALIZED,
  data: {
    collections: {},
    nfts: {},
    nftFilters: {
      totalResults: 0,
      activeFilters: {},
    },
    loadingState: {
      isUpdatingPancakeBunnies: false,
      latestPancakeBunniesUpdateAt: 0,
    },
    users: {},
    user: {
      userNftsInitializationState: UserNftInitializationState.UNINITIALIZED,
      nfts: [],
      activity: {
        initializationState: UserNftInitializationState.UNINITIALIZED,
        askOrderHistory: [],
        buyTradeHistory: [],
        sellTradeHistory: [],
      },
    },
  },
}

/**
 * Fetch all collections data by combining data from the API (static metadata) and the Subgraph (dynamic market data)
 */
export const fetchCollections = createAsyncThunk<Record<string, Collection>>('nft/fetchCollections', async () => {
  const [collections, collectionsMarket] = await Promise.all([getCollectionsApi(), getCollectionsSg()])
  return combineCollectionData(collections, collectionsMarket)
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

    return combineCollectionData([collection], [collectionMarket])
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
    const [nfts, nftsMarket] = await Promise.all([
      getNftsFromCollectionApi(collectionAddress, size, page),
      getNftsFromCollectionSg(collectionAddress, size, (page - 1) * size), // sg uses a skip value rather than page
    ])

    if (!nfts?.data) {
      return []
    }

    return Object.keys(nfts.data).map((id) => {
      const apiMetadata = nfts.data[id]
      const marketData = nftsMarket.find((nft) => nft.tokenId === id)
      return {
        tokenId: id,
        name: apiMetadata.name,
        description: apiMetadata.description,
        collectionName: apiMetadata.collection.name,
        collectionAddress,
        image: apiMetadata.image,
        marketData,
        attributes: apiMetadata.attributes,
      }
    })
  } catch (error) {
    console.error(`Failed to fetch collection NFTs for ${collectionAddress}`, error)
    return []
  }
})

export const filterNftsFromCollection = createAsyncThunk<
  { totalResults: number; nftTokens: NftToken[] },
  { collectionAddress: string; attrs: NftFilter['attributes'] }
>('nft/filterNftsFromCollection', async ({ collectionAddress, attrs }) => {
  try {
    const filters = Object.values(attrs).reduce(
      (accum, attr) => ({
        ...accum,
        [attr.traitType]: attr.value,
      }),
      {},
    )
    const filteredNfts = await fetchNftsFiltered(collectionAddress, filters)

    // Fetch market data for each token returned
    const tokenIds = Object.values(filteredNfts.data).map((apiToken) => apiToken.tokenId)
    const marketData = await getNftsMarketData({ tokenId_in: tokenIds, collection: collectionAddress.toLowerCase() })

    const nftTokens: NftToken[] = Object.values(filteredNfts.data).map((apiToken) => {
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

    return { totalResults: filteredNfts.total, nftTokens }
  } catch {
    return { totalResults: 0, nftTokens: [] }
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

export const fetchUserNfts = createAsyncThunk<
  NftToken[],
  { account: string; profileNftWithCollectionAddress?: TokenIdWithCollectionAddress; collections: ApiCollections }
>('nft/fetchUserNfts', async ({ account, profileNftWithCollectionAddress, collections }) => {
  const completeNftData = await getCompleteAccountNftData(account, collections, profileNftWithCollectionAddress)
  return completeNftData
})

export const updateUserNft = createAsyncThunk<
  NftToken,
  { tokenId: string; collectionAddress: string; location?: NftLocation }
>('nft/updateUserNft', async ({ tokenId, collectionAddress, location = NftLocation.WALLET }) => {
  const marketDataForNft = await getNftsMarketData({
    tokenId_in: [tokenId],
    collection: collectionAddress.toLowerCase(),
  })
  const metadataForNft = await getNftsFromDifferentCollectionsApi([{ tokenId, collectionAddress }])
  const completeNftData = { ...metadataForNft[0], location, marketData: marketDataForNft[0] }

  return completeNftData
})

export const removeUserNft = createAsyncThunk<string, { tokenId: string }>(
  'nft/removeUserNft',
  async ({ tokenId }) => tokenId,
)

export const addUserNft = createAsyncThunk<
  NftToken,
  { tokenId: string; collectionAddress: string; nftLocation?: NftLocation }
>('nft/addUserNft', async ({ tokenId, collectionAddress, nftLocation = NftLocation.WALLET }) => {
  const marketDataForNft = await getNftsMarketData({
    tokenId_in: [tokenId],
    collection: collectionAddress.toLowerCase(),
  })
  const metadataForNft = await getNftsFromDifferentCollectionsApi([{ tokenId, collectionAddress }])

  return {
    ...metadataForNft[0],
    location: nftLocation,
    marketData: marketDataForNft[0],
  }
})

export const fetchUserActivity = createAsyncThunk('nft/fetchUserActivity', async (address: string) => {
  const userActivity = await getUserActivity(address.toLocaleLowerCase())
  return userActivity
})

export const NftMarket = createSlice({
  name: 'NftMarket',
  initialState,
  reducers: {
    addAttributeFilter: (state, action: PayloadAction<{ collectionAddress: string; attr: NftAttribute }>) => {
      const { collectionAddress, attr } = action.payload

      state.data.nftFilters.activeFilters[collectionAddress].attributes = {
        ...state.data.nftFilters.activeFilters[collectionAddress].attributes,
        [attr.traitType]: attr,
      }
    },
    removeAttributeFilter: (state, action: PayloadAction<{ collectionAddress: string; traitType: string }>) => {
      const { collectionAddress, traitType } = action.payload

      if (state.data.nftFilters[collectionAddress]) {
        delete state.data.nftFilters.activeFilters[collectionAddress].attributes[traitType]
      }
    },
    removeAllFilters: (state, action: PayloadAction<string>) => {
      state.data.nftFilters.activeFilters[action.payload] = { attributes: {} }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(filterNftsFromCollection.pending, (state, action) => {
      const { collectionAddress } = action.meta.arg
      state.data.nfts[collectionAddress] = null // To trigger loading state
    })
    builder.addCase(filterNftsFromCollection.fulfilled, (state, action) => {
      const { nftTokens, totalResults } = action.payload
      const { collectionAddress } = action.meta.arg

      state.data.nftFilters.totalResults = totalResults
      state.data.nfts[collectionAddress] = nftTokens
    })
    builder.addCase(fetchCollection.fulfilled, (state, action) => {
      state.data.collections = { ...state.data.collections, ...action.payload }
    })
    builder.addCase(fetchCollections.fulfilled, (state, action) => {
      state.data.collections = action.payload
      state.initializationState = NFTMarketInitializationState.INITIALIZED
    })
    builder.addCase(fetchNftsFromCollections.fulfilled, (state, action) => {
      const { collectionAddress } = action.meta.arg
      const existingNfts = state.data.nfts[collectionAddress] ?? []

      // Reset filters
      state.data.nftFilters.activeFilters[collectionAddress] = { attributes: {} }
      state.data.nfts[collectionAddress] = [...existingNfts, ...action.payload]
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
    builder.addCase(fetchUserNfts.rejected, (state) => {
      state.data.user.userNftsInitializationState = UserNftInitializationState.ERROR
    })
    builder.addCase(fetchUserNfts.pending, (state) => {
      state.data.user.userNftsInitializationState = UserNftInitializationState.INITIALIZING
    })
    builder.addCase(fetchUserNfts.fulfilled, (state, action) => {
      state.data.user.nfts = action.payload
      state.data.user.userNftsInitializationState = UserNftInitializationState.INITIALIZED
    })
    builder.addCase(updateUserNft.fulfilled, (state, action) => {
      const userNftsState: NftToken[] = state.data.user.nfts
      const nftToUpdate = userNftsState.find((nft) => nft.tokenId === action.payload.tokenId)
      const indexInState = userNftsState.indexOf(nftToUpdate)
      state.data.user.nfts[indexInState] = action.payload
    })
    builder.addCase(removeUserNft.fulfilled, (state, action) => {
      const copyOfState: NftToken[] = [...state.data.user.nfts]
      const nftToRemove = copyOfState.find((nft) => nft.tokenId === action.payload)
      const indexInState = copyOfState.indexOf(nftToRemove)
      copyOfState.splice(indexInState, 1)
      state.data.user.nfts = copyOfState
    })
    builder.addCase(addUserNft.fulfilled, (state, action) => {
      state.data.user.nfts = [...state.data.user.nfts, action.payload]
    })
    builder.addCase(fetchUserActivity.fulfilled, (state, action) => {
      state.data.user.activity = { ...action.payload, initializationState: UserNftInitializationState.INITIALIZED }
    })
    builder.addCase(fetchUserActivity.rejected, (state) => {
      state.data.user.activity.initializationState = UserNftInitializationState.ERROR
    })
    builder.addCase(fetchUserActivity.pending, (state) => {
      state.data.user.activity.initializationState = UserNftInitializationState.INITIALIZING
    })
  },
})

// Actions
export const { addAttributeFilter, removeAttributeFilter, removeAllFilters } = NftMarket.actions

export default NftMarket.reducer
