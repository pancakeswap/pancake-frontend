import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import mapValues from 'lodash/mapValues'
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
  NFT,
  TokenIdWithCollectionAddress,
  NFTMarketInitializationState,
  NftTokenSg,
  UserActivity,
  NftLocation,
  UserNftInitializationState,
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
export const fetchNftsFromCollections = createAsyncThunk<NFT[], string>(
  'nft/fetchNftsFromCollections',
  async (collectionAddress) => {
    const [nfts, nftsMarket] = await Promise.all([
      getNftsFromCollectionApi(collectionAddress),
      getNftsFromCollectionSg(collectionAddress),
    ])

    // Separate market data by token id
    const nftsMarketObj: Record<string, NftTokenSg> = nftsMarket.reduce(
      (accum, nftMarketData) => ({ ...accum, [nftMarketData.tokenId]: { ...nftMarketData } }),
      {},
    )

    return mapValues(nfts, (nft, key) => {
      return {
        id: key,
        ...nft,
        tokens: nft.tokens.reduce((accum: Record<string, NftTokenSg>, tokenId: string) => {
          const token = nftsMarketObj[tokenId]
          return { ...accum, [tokenId]: token }
        }, {}),
      }
    })
  },
)

export const fetchUserNfts = createAsyncThunk<
  NFT[],
  { account: string; profileNftWithCollectionAddress: TokenIdWithCollectionAddress; collections: ApiCollections }
>('nft/fetchUserNfts', async ({ account, profileNftWithCollectionAddress, collections }) => {
  const walletNftIds = await fetchWalletTokenIdsForCollections(account, collections)
  if (profileNftWithCollectionAddress?.tokenId) {
    walletNftIds.push(profileNftWithCollectionAddress)
  }
  const tokenIds = walletNftIds.map((nft) => nft.tokenId)

  const marketDataForWalletNfts = await getNftsMarketData({ tokenId_in: tokenIds })
  const walletNftsWithMarketData = attachMarketDataToWalletNfts(
    walletNftIds,
    marketDataForWalletNfts,
    account,
    profileNftWithCollectionAddress?.tokenId,
  )

  const marketDataForSaleNfts = await getNftsMarketData({ currentSeller: account.toLowerCase() })
  const nftsForSaleWithCategory = marketDataForSaleNfts.map((nft) => {
    return { ...nft, nftLocation: NftLocation.FORSALE }
  })

  const forSaleNftIds = marketDataForSaleNfts.map((nft) => {
    return { collectionAddress: nft.collection.id, tokenId: nft.tokenId }
  })

  const metadataForAllNfts = await getNftsFromDifferentCollectionsApi([...walletNftIds, ...forSaleNftIds])

  const completeNftData = combineNftMarketAndMetadata(
    metadataForAllNfts,
    nftsForSaleWithCategory,
    walletNftsWithMarketData,
  )

  return completeNftData
})

export const fetchUserActivity = createAsyncThunk<UserActivity, string>('nft/fetchUserActivity', async (address) => {
  const userActivity = await getUserActivity({ id: address.toLocaleLowerCase() })
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
    builder.addCase(fetchUserActivity.fulfilled, (state, action) => {
      state.data.user.activity = action.payload
    })
  },
})

export default NftMarket.reducer
