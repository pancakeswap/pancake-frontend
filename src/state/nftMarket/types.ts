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
  }
}

export interface Transaction {
  hash: string
  block: BigNumberish
  timestamp: BigNumberish
  price: BigNumberish
  netPrice: BigNumberish
  buyerAddress: string
  sellerAddress: string
  withBNB: boolean
}

interface Image {
  original: string
  thumbnail: string
}

// Return type from subgraph
export interface NftToken {
  tokenId: BigNumberish
  currentSeller: string
  isTradable: boolean
  metadataUrl: string
}

export interface NFT {
  id: BigNumberish
  name: string
  description: string
  image: Image
  tokens: Record<number, NftToken>
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
}

export interface User {
  address: string
  numberTokensListed: BigNumberish
  numberTokensPurchased: BigNumberish
  numberTokensSold: BigNumberish
  nfts: Record<string, BigNumberish> // String is an address, BigNumberish is a tokenID
}
