import { BigNumberish } from 'ethers'

// Collections -> Nfts -> Transactions
// Users -> Nft tokens IDs

// TODO: Handle the error state on the UI
export enum NFTMarketInitializationState {
  UNINITIALIZED = 'UNINITIALIZED',
  INITIALIZED = 'INITIALIZED',
  ERROR = 'ERROR',
}

export interface State {
  initializationState: NFTMarketInitializationState
  data: {
    collections: Record<string, Collection> // string is the address
    nfts: Record<string, NFT[]> // string is the address
    users: Record<string, User> // string is the address
    user: UserNftsState
  }
}

export interface UserNftsState {
  userNftsInitialised: boolean
  nfts: NftTokenSg[]
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
  nft?: NftTokenSg
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
  nft?: NftTokenSg
}

export interface UserActivity {
  askOrderHistory: AskOrder[]
  buyTradeHistory: Transaction[]
  sellTradeHistory: Transaction[]
}

interface Image {
  original: string
  thumbnail: string
  mp4?: string
  webm?: string
  gif?: string
}

// Return type from subgraph
export interface NftTokenSg {
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
  transactionHistory?: Transaction[]
}

export interface NFT {
  id: string
  tokenId: string
  name: string
  collectionName: string
  description: string
  image: Image
  tokens?: Record<number, NftTokenSg>
  attributes?: any[]
}

export interface TokenIdWithCollectionAddress {
  collectionAddress: string
  tokenId: string
}

export interface Collection {
  id: string
  address: string
  name: string
  description?: string
  slug: string
  symbol: string
  active: boolean
  totalVolumeBNB: BigNumberish
  numberTokensListed: BigNumberish
  tradingFee: BigNumberish
  creatorFee: BigNumberish
  image: Image
  owner: string
  totalSupply: BigNumberish
  verified: boolean
  avatar: string
  banner: {
    large: string
    small: string
  }
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
