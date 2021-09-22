import { BigNumberish } from 'ethers'

// Collections -> Nfts -> Transactions
// Users -> Nft tokens IDs

// TODO: Handle the error state on the UI
export enum NFTMarketInitializationState {
  UNINITIALIZED = 'UNINITIALIZED',
  INITIALIZED = 'INITIALIZED',
  ERROR = 'ERROR',
}

export enum UserNftInitializationState {
  UNINITIALIZED = 'UNINITIALIZED',
  INITIALIZING = 'INITIALIZING',
  INITIALIZED = 'INITIALIZED',
  ERROR = 'ERROR',
}

export interface State {
  initializationState: NFTMarketInitializationState
  data: {
    collections: Record<string, Collection> // string is the address
    nfts: Record<string, Record<string, PancakeBunnyNftWithTokens>> // first string is the collection address address, second string is bunny id
    users: Record<string, User> // string is the address
    user: UserNftsState
  }
}

export interface UserNftsState {
  userNftsInitializationState: UserNftInitializationState
  nfts: NftToken[]
  activity: UserActivity
}

export interface Transaction {
  id: string
  block: string
  timestamp: string
  askPrice: string
  netPrice: string
  buyer: { id: string }
  seller: { id: string }
  withBNB: boolean
  nft?: TokenMarketData
}

export enum AskOrderType {
  NEW = 'NEW',
  MODIFY = 'MODIFY',
  CANCEL = 'CANCEL',
}

export interface AskOrder {
  id: string
  block: string
  timestamp: string
  askPrice: string
  orderType: AskOrderType
  nft?: TokenMarketData
}

export interface Image {
  original: string
  thumbnail: string
  mp4?: string
  webm?: string
  gif?: string
}

export enum NftLocation {
  FORSALE = 'FORSALE',
  PROFILE = 'PROFILE',
  WALLET = 'WALLET',
}

// Market data regarding specific token ID, acquired via subgraph
export interface TokenMarketData {
  tokenId: string
  metadataUrl: string
  currentAskPrice: string
  currentSeller: string
  latestTradedPriceInBNB: string
  tradeVolumeBNB: string
  totalTrades: string
  isTradable: boolean
  collection?: {
    id: string
  }
  updatedAt?: string
  transactionHistory?: Transaction[]
}

// This type is somewhat specific to PancakeBunnies NFTs
// It stores basic PancakeBunny NFT data together with `tokens` object containing specific token ID market data
// It is used when retrieving all bunny tokens from redux.
// In case you need to work with specific stand-alone token use NftToken
export interface PancakeBunnyNftWithTokens {
  name: string
  collectionName: string
  collectionAddress: string
  description: string
  image: Image
  tokens?: Record<number, TokenMarketData>
  lowestPricedToken?: TokenMarketData
  attributes?: any[]
  updatedAt?: string
  meta?: Record<string, string | number>
}

// Represents single NFT token, either Squad-like NFT or single PancakeBunny.
// Main difference between this and NFT is absense of `tokens` object holding "grouped" tokens and presence of tokenId on the main object level
export interface NftToken {
  tokenId: string
  name: string
  description: string
  collectionName: string
  collectionAddress: string
  image: Image
  attributes?: any[]
  createdAt: string
  updatedAt: string
  marketData?: TokenMarketData
  location?: NftLocation
  meta?: Record<string, string | number>
}

export interface TokenIdWithCollectionAddress {
  collectionAddress: string
  tokenId: string
  nftLocation?: NftLocation
}

export interface NftAttribute {
  traitType: string
  value: string | number
  displayType: string
}

// Internal type used to refer to a collection
// Most fields are populated from API (via ApiCollection type)
export interface Collection {
  id: string
  address: string
  name: string
  description?: string
  symbol: string
  active: boolean
  totalVolumeBNB: BigNumberish
  numberTokensListed: BigNumberish
  tradingFee: BigNumberish
  creatorFee: BigNumberish
  owner: string
  totalSupply: BigNumberish
  verified: boolean
  avatar: string
  banner: {
    large: string
    small: string
  }
  attributes?: NftAttribute[]
}

export interface ApiCollections {
  [key: string]: Collection
}

export interface User {
  address: string
  numberTokensListed: BigNumberish
  numberTokensPurchased: BigNumberish
  numberTokensSold: BigNumberish
  nfts: Record<string, BigNumberish> // String is an address, BigNumberish is a tokenID
}

/**
 * API RESPONSES
 */

export interface ApiCollection {
  address: string
  owner: string
  name: string
  description: string
  symbol: string
  totalSupply: string
  verified: boolean
  createdAt: string
  updatedAt: string
  avatar: string
  banner: {
    large: string
    small: string
  }
  attributes?: NftAttribute[] // returned for specific collection but not for all collections
}

// Get all collections
// ${API_NFT}/collections/
export interface ApiCollectionsReponse {
  total: number
  data: ApiCollection[]
}

// Get single collection
// ${API_NFT}/collections/${collectionAddress}
export interface ApiSingleCollectionResponse {
  data: ApiCollection
}

// Get tokens within collection
// ${API_NFT}/collections/${collectionAddress}/tokens
export interface ApiResponseCollectionTokens {
  total: number
  attributeDistribution: Record<string, number>
  data: {
    [key: string]: {
      name: string
      description: string
      image: Image
      collection: {
        name: string
      }
      tokens: number[]
    }
  }
}

// Get specific token data
// ${API_NFT}/collections/${collectionAddress}/tokens/${tokenId}
export interface ApiResponseSpecificToken {
  data: {
    tokenId: string
    name: string
    description: string
    image: Image
    createdAt: string
    updatedAt: string
    attributes: NftAttribute[]
    collection: {
      name: string
    }
  }
}

/**
 * SUBGRAPH RESPONSES
 */

export interface CollectionMarketDataBaseFields {
  id: string
  name: string
  symbol: string
  active: boolean
  totalTrades: string
  totalVolumeBNB: string
  numberTokensListed: string
  creatorAddress: string
  tradingFee: string
  creatorFee: string
  whitelistChecked: string
}

export interface UserActivity {
  askOrderHistory: AskOrder[]
  buyTradeHistory: Transaction[]
  sellTradeHistory: Transaction[]
}
