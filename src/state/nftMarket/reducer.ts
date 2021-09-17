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
} from './types'

const initialState: State = {
  initializationState: NFTMarketInitializationState.UNINITIALIZED,
  data: {
    collections: {},
    nfts: {},
    users: {},
    user: {
      userNftsInitialised: false,
      nfts: [],
      activity: { askOrderHistory: [], buyTradeHistory: [], sellTradeHistory: [] },
    },
  },
}

/**
 * Fetch all collections data by combining data from the API (static metadata) and the Subgraph (dynamic market data)
 */
export const fetchCollections = createAsyncThunk<{ [key: string]: Collection }>('nft/fetchCollections', async () => {
  const collections = await getCollectionsApi()
  const collectionsMarket = await getCollectionsSg()
  const collectionsMarketObj = collectionsMarket.reduce(
    (prev, current) => ({ ...prev, [current.id]: { ...current } }),
    {},
  )

  return collections.reduce((prev, current) => {
    const collectionMarket = collectionsMarketObj[current.address.toLowerCase()]
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
  NftTokenSg[],
  { account: string; profileNftWithCollectionAddress: TokenIdWithCollectionAddress; collections: ApiCollections }
>('nft/fetchUserNfts', async ({ account, profileNftWithCollectionAddress, collections }) => {
  const getCategoryForNftWithMarketData = (marketNft: NftTokenSg): NftLocation => {
    if (profileNftWithCollectionAddress?.tokenId === marketNft.tokenId) {
      return NftLocation.PROFILE
    }
    if (marketNft.isTradable && marketNft.currentSeller === account.toLowerCase()) {
      return NftLocation.FORSALE
    }
    return NftLocation.WALLET
  }

  const nftsInWallet = await fetchWalletTokenIdsForCollections(account, collections)

  if (profileNftWithCollectionAddress?.tokenId) {
    nftsInWallet.push(profileNftWithCollectionAddress)
  }

  const nftIdsInWallet = nftsInWallet.map((nft) => nft.tokenId)
  const marketDataForNftsInWallet = await getNftsMarketData({ tokenId_in: nftIdsInWallet })

  const walletNftsWithMarketData = nftsInWallet.map((walletNft) => {
    const marketData = marketDataForNftsInWallet.find((marketNft) => marketNft.tokenId === walletNft.tokenId)
    return marketData
      ? { ...marketData, nftLocation: getCategoryForNftWithMarketData(marketData) }
      : {
          tokenId: walletNft.tokenId,
          collection: {
            id: walletNft.collectionAddress.toLowerCase(),
          },
          nftLocation: walletNft.nftLocation,
          metadataUrl: null,
          transactionHistory: null,
          currentSeller: null,
          isTradable: null,
          currentAskPrice: null,
          latestTradedPriceInBNB: null,
          tradeVolumeBNB: null,
          totalTrades: null,
        }
  })

  const nftsForSale = await getNftsMarketData({ currentSeller: account.toLowerCase() })
  const nftsForSaleWithCategory = nftsForSale.map((nft) => {
    return { ...nft, nftLocation: NftLocation.FORSALE }
  })

  return [...walletNftsWithMarketData, ...nftsForSaleWithCategory]
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
    builder.addCase(fetchCollections.fulfilled, (state, action) => {
      state.data.collections = action.payload
      state.initializationState = NFTMarketInitializationState.INITIALIZED
    })
    builder.addCase(fetchNftsFromCollections.fulfilled, (state, action) => {
      state.data.nfts[action.meta.arg] = action.payload
    })
    builder.addCase(fetchUserNfts.fulfilled, (state, action) => {
      state.data.user.nfts = action.payload
      state.data.user.userNftsInitialised = true
    })
    builder.addCase(fetchUserActivity.fulfilled, (state, action) => {
      state.data.user.activity = action.payload
    })
  },
})

export default NftMarket.reducer
