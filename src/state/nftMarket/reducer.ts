import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import mapValues from 'lodash/mapValues'
import {
  getNftsFromCollectionApi,
  getNftsFromCollectionSg,
  getCollectionsApi,
  getCollectionsSg,
  getNftsMarketData,
  fetchWalletNftIds,
} from './helpers'
import { State, Collection, NFT, NftSubgraphEntity, NFTMarketInitializationState } from './types'

const initialState: State = {
  initializationState: NFTMarketInitializationState.UNINITIALIZED,
  data: {
    collections: {},
    nfts: {},
    users: {},
    userNfts: { isInitialized: false, nfts: [] },
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
    const nfts = await getNftsFromCollectionApi(collectionAddress)
    const nftsMarket = await getNftsFromCollectionSg(collectionAddress)
    const nftsMarketObj = nftsMarket.reduce(
      (prev, current) => ({ ...prev, [current.tokenId as number]: { ...current } }),
      {},
    )

    return mapValues(nfts, (nft, key) => {
      return {
        id: key,
        ...nft,
        tokens: nft.tokens.reduce((prev, current) => {
          const token = nftsMarketObj[current]
          return { ...prev, [current]: token }
        }, {}),
      }
    })
  },
)

export const fetchUserNfts = createAsyncThunk<NftSubgraphEntity[], { account: string; profileNftTokenId: string }>(
  'nft/fetchUserNfts',
  async ({ account, profileNftTokenId }) => {
    const nftIdsInWallet = await fetchWalletNftIds(account)
    if (profileNftTokenId) {
      nftIdsInWallet.push(profileNftTokenId)
    }
    const marketDataForNftsInWallet = await getNftsMarketData({ tokenId_in: nftIdsInWallet })
    const walletNftsWithMarketData = nftIdsInWallet.map((walletId) => {
      const marketData = marketDataForNftsInWallet.find((marketNft) => marketNft.tokenId === walletId)
      return marketData || { tokenId: walletId, metadataUrl: null, transactionHistory: null }
    })
    const marketDataForNftsOnSale = await getNftsMarketData({ currentSeller: account.toLowerCase() })
    return [...walletNftsWithMarketData, ...marketDataForNftsOnSale]
  },
)

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
      state.data.userNfts.nfts = action.payload
      state.data.userNfts.isInitialized = true
    })
  },
})

export default NftMarket.reducer
