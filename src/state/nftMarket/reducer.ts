import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
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
} from './types'

const initialState: State = {
  initializationState: NFTMarketInitializationState.UNINITIALIZED,
  data: {
    collections: {},
    nfts: {},
    isFetchingMoreNfts: false,
    latestFetchAt: 0,
    lastUpdateAt: Date.now(),
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
export const fetchNftsFromCollections = createAsyncThunk(
  'nft/fetchNftsFromCollections',
  async (collectionAddress: string) => {
    try {
      const [nfts, nftsMarket] = await Promise.all([
        getNftsFromCollectionApi(collectionAddress),
        getNftsFromCollectionSg(collectionAddress),
      ])

      if (!nfts?.data) {
        return []
      }

      if (collectionAddress === pancakeBunniesAddress) {
        return nftsMarket.map((marketData) => {
          // The fallback is just for the testnet where some bunnies don't exist
          const apiMetadata = nfts.data[marketData.otherId] ?? {
            name: '',
            description: '',
            collection: { name: 'Pancake Bunnies' },
            image: {
              original: '',
              thumbnail: '',
            },
          }
          // Generating attributes field that is not returned by API but can be "faked" since objects are keyed with bunny id
          const attributes = [
            {
              traitType: 'bunnyId',
              value: marketData.otherId,
              displayType: null,
            },
          ]
          return {
            tokenId: marketData.tokenId,
            name: apiMetadata.name,
            description: apiMetadata.description,
            collectionName: apiMetadata.collection.name,
            collectionAddress,
            image: apiMetadata.image,
            marketData,
            attributes,
          }
        })
      }

      // TODO: revisit this for other collecitons
      return []
    } catch (error) {
      console.error(`Failed to fetch collection NFTs for ${collectionAddress}`, error)
      return []
    }
  },
)

/**
 * Fetch fresh marketdata for existing tokens in the store
 */
export const updateNftTokensData = createAsyncThunk<
  NftToken[],
  { collectionAddress: string; existingTokenIds: string[] }
>('nft/updateNftTokensData', async ({ collectionAddress, existingTokenIds }) => {
  try {
    // TODO: this kinda should work for other collections too, but doublecheck during Squad integration
    const [nfts, nftsMarket] = await Promise.all([
      getNftsFromCollectionApi(collectionAddress),
      getMarketDataForTokenIds(collectionAddress, existingTokenIds),
    ])

    if (!nfts?.data) {
      return []
    }

    return nftsMarket.map((marketData) => {
      // The fallback is just for the testnet where some bunnies don't exist
      const apiMetadata = nfts.data[marketData.otherId] ?? {
        name: '',
        description: '',
        collection: { name: 'Pancake Bunnies' },
        image: {
          original: '',
          thumbnail: '',
        },
      }
      // Generating attributes field that is not returned by API but can be "faked" since objects are keyed with bunny id
      const attributes = [
        {
          traitType: 'bunnyId',
          value: marketData.otherId,
          displayType: null,
        },
      ]
      return {
        tokenId: marketData.tokenId,
        name: apiMetadata.name,
        description: apiMetadata.description,
        collectionName: apiMetadata.collection.name,
        collectionAddress: pancakeBunniesAddress,
        image: apiMetadata.image,
        marketData,
        attributes,
      }
    })
  } catch (error) {
    console.error(`Failed to update collection NFTs for ${collectionAddress}`, error)
    return []
  }
})

/**
 * Fetch all 30 on sale NFTs with specified bunny id
 */
export const fetchNftsByBunnyId = createAsyncThunk<
  NftToken[],
  { bunnyId: string; existingTokenIds: string[]; existingMetadata: ApiSingleTokenData; orderDirection: 'asc' | 'desc' }
>('nft/fetchNftsByBunnyId', async ({ bunnyId, existingTokenIds, existingMetadata, orderDirection }) => {
  try {
    let nfts = { data: { [bunnyId]: existingMetadata } }
    if (!existingMetadata) {
      nfts = await getNftsFromCollectionApi(pancakeBunniesAddress)
    }
    const nftsMarket = await getNftsByBunnyIdSg(bunnyId, existingTokenIds, orderDirection)

    if (!nfts?.data) {
      return []
    }

    return nftsMarket.map((marketData) => {
      // The fallback is just for the testnet where some bunnies don't exist
      const apiMetadata = nfts.data[marketData.otherId] ?? {
        name: '',
        description: '',
        collection: { name: 'Pancake Bunnies' },
        image: {
          original: '',
          thumbnail: '',
        },
      }
      // Generating attributes field that is not returned by API but can be "faked" since objects are keyed with bunny id
      const attributes = [
        {
          traitType: 'bunnyId',
          value: marketData.otherId,
          displayType: null,
        },
      ]
      return {
        tokenId: marketData.tokenId,
        name: apiMetadata.name,
        description: apiMetadata.description,
        collectionName: apiMetadata.collection.name,
        collectionAddress: pancakeBunniesAddress,
        image: apiMetadata.image,
        marketData,
        attributes,
      }
    })
  } catch (error) {
    console.error(`Failed to fetch collection NFTs for bunny id ${bunnyId}`, error)
    return []
  }
})

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
  const marketDataForNft = await getNftsMarketData({ tokenId_in: [tokenId] })
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
  const marketDataForNft = await getNftsMarketData({ tokenId_in: [tokenId] })
  const metadataForNft = await getNftsFromDifferentCollectionsApi([{ tokenId, collectionAddress }])

  const tokens = { [tokenId]: { ...marketDataForNft[0], nftLocation } }
  const completeNftData = { ...metadataForNft[0], tokens }

  return completeNftData
})

export const fetchUserActivity = createAsyncThunk('nft/fetchUserActivity', async (address: string) => {
  const userActivity = await getUserActivity(address.toLocaleLowerCase())
  return userActivity
})

export const NftMarket = createSlice({
  name: 'NftMarket',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCollection.fulfilled, (state, action) => {
      state.data.collections = { ...state.data.collections, ...action.payload }
    })
    builder.addCase(fetchCollections.fulfilled, (state, action) => {
      state.data.collections = action.payload
      state.initializationState = NFTMarketInitializationState.INITIALIZED
    })
    builder.addCase(fetchNftsFromCollections.fulfilled, (state, action) => {
      state.data.nfts[action.meta.arg] = action.payload
    })
    builder.addCase(updateNftTokensData.fulfilled, (state, action) => {
      if (action.payload.length > 0) {
        state.data.nfts[action.meta.arg.collectionAddress] = action.payload
        state.data.lastUpdateAt = Date.now()
      }
    })
    builder.addCase(updateNftTokensData.rejected, (state) => {
      state.data.lastUpdateAt = Date.now()
    })
    builder.addCase(fetchNftsByBunnyId.pending, (state) => {
      state.data.isFetchingMoreNfts = true
    })
    builder.addCase(fetchNftsByBunnyId.fulfilled, (state, action) => {
      const existingNftsInState = state.data.nfts[pancakeBunniesAddress] || []
      state.data.nfts[pancakeBunniesAddress] = [...existingNftsInState, ...action.payload]
      state.data.isFetchingMoreNfts = false
      state.data.latestFetchAt = Date.now()
    })
    builder.addCase(fetchNftsByBunnyId.rejected, (state) => {
      state.data.isFetchingMoreNfts = false
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

export default NftMarket.reducer
