import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { pancakeBunniesAddress } from 'views/Nft/market/constants'
import {
  getNftsFromCollectionApi,
  getNftsFromCollectionSg,
  getNftsMarketData,
  fetchWalletTokenIdsForCollections,
  getCollectionsApi,
  getCollectionsSg,
  getUserActivity,
  combineCollectionData,
  getCollectionSg,
  getCollectionApi,
  getNftsFromDifferentCollectionsApi,
  attachMarketDataToWalletNfts,
  combineNftMarketAndMetadata,
} from './helpers'
import {
  State,
  Collection,
  ApiCollections,
  TokenIdWithCollectionAddress,
  NFTMarketInitializationState,
  UserActivity,
  UserNftInitializationState,
  NftToken,
  NftLocation,
} from './types'

const initialState: State = {
  initializationState: NFTMarketInitializationState.UNINITIALIZED,
  data: {
    collections: {},
    nfts: {},
    users: {},
    user: {
      userNftsInitializationState: UserNftInitializationState.UNINITIALIZED,
      nfts: [],
      activity: { askOrderHistory: [], buyTradeHistory: [], sellTradeHistory: [] },
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

// Fetches user NFTs from their wallet, profile pic and on sale in market
// Combines them with market data and assigns location
export const fetchUserNfts = createAsyncThunk<
  NftToken[],
  { account: string; profileNftWithCollectionAddress?: TokenIdWithCollectionAddress; collections: ApiCollections }
>('nft/fetchUserNfts', async ({ account, profileNftWithCollectionAddress, collections }) => {
  const walletNftIds = await fetchWalletTokenIdsForCollections(account, collections)
  if (profileNftWithCollectionAddress?.tokenId) {
    walletNftIds.push(profileNftWithCollectionAddress)
  }
  const tokenIds = walletNftIds.map((nft) => nft.tokenId)

  const marketDataForWalletNfts = await getNftsMarketData({ tokenId_in: tokenIds })
  const walletNftsWithMarketData = attachMarketDataToWalletNfts(walletNftIds, marketDataForWalletNfts)

  const tokenIdsInWallet = walletNftIds
    .filter((walletNft) => {
      // Profile Pic NFT is included in walletNftIds array, hence this filter
      return profileNftWithCollectionAddress?.tokenId !== walletNft.tokenId
    })
    .map((nft) => nft.tokenId)

  const marketDataForSaleNfts = await getNftsMarketData({ currentSeller: account.toLowerCase() })
  const tokenIdsForSale = marketDataForSaleNfts.map((nft) => nft.tokenId)

  const forSaleNftIds = marketDataForSaleNfts.map((nft) => {
    return { collectionAddress: nft.collection.id, tokenId: nft.tokenId }
  })

  const metadataForAllNfts = await getNftsFromDifferentCollectionsApi([...walletNftIds, ...forSaleNftIds])

  const completeNftData = combineNftMarketAndMetadata(
    metadataForAllNfts,
    marketDataForSaleNfts,
    walletNftsWithMarketData,
    tokenIdsInWallet,
    tokenIdsForSale,
    profileNftWithCollectionAddress?.tokenId,
  )

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

export const fetchUserActivity = createAsyncThunk<UserActivity, string>('nft/fetchUserActivity', async (address) => {
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
      state.data.user.activity = action.payload
    })
  },
})

export default NftMarket.reducer
