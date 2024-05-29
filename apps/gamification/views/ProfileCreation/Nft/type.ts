import { Address } from 'viem'

export interface Image {
  original: string
  thumbnail: string
  mp4?: string
  webm?: string
  gif?: string
}

export interface NftAttribute {
  traitType: string
  value: string | number | undefined
  displayType: string | null
}

export interface ApiSingleTokenData {
  name: string
  description: string
  image: Image
  collection: {
    name: string
  }
  attributes?: NftAttribute[]
  tokenId?: string
}

// Get tokens within collection
// ${API_NFT}/collections/${collectionAddress}/tokens
export interface ApiResponseCollectionTokens {
  total: number
  attributesDistribution: Record<string, number>
  data: Record<string, ApiSingleTokenData>
}

export enum NftLocation {
  FORSALE = 'For Sale',
  PROFILE = 'Profile Pic',
  WALLET = 'In Wallet',
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

export interface TokenMarketData {
  tokenId: string
  collection: {
    id: string
  }
  currentAskPrice: string
  currentSeller: string
  isTradable: boolean
  metadataUrl?: string
  latestTradedPriceInBNB?: string
  tradeVolumeBNB?: string
  totalTrades?: string
  otherId?: string
  updatedAt?: string
  transactionHistory?: Transaction[]
}

export interface NftToken {
  tokenId: string
  name: string
  description: string
  collectionName: string
  collectionAddress: Address
  image: Image
  attributes?: NftAttribute[]
  createdAt?: string // API createdAt
  updatedAt?: string // API updatedAt
  marketData?: TokenMarketData
  location?: NftLocation
  meta?: Record<string, string | number>
}

export interface Collection {
  id: Address
  address: Address
  name: string
  createdAt?: string
  description?: string
  symbol: string
  active: boolean
  totalVolumeBNB: string
  numberTokensListed: string
  tradingFee: string
  creatorFee: string
  owner: string
  totalSupply: string
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

export interface ApiCollection {
  address: Address
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
export interface ApiCollectionsResponse {
  total: number
  data: ApiCollection[]
}

export interface CollectionMarketDataBaseFields {
  id: Address
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

export interface TokenIdWithCollectionAddress {
  collectionAddress: Address
  tokenId?: string
  nftLocation?: NftLocation
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

export enum AskOrderType {
  NEW = 'New',
  MODIFY = 'Modify',
  CANCEL = 'Cancel',
}

export interface AskOrder {
  id: string
  block: string
  timestamp: string
  askPrice: string
  orderType: AskOrderType
  nft?: TokenMarketData
  seller?: { id: string }
}

export interface UserActivity {
  askOrderHistory: AskOrder[]
  buyTradeHistory: Transaction[]
  sellTradeHistory: Transaction[]
}
