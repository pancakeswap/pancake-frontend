import { BigNumberish } from 'ethers'
import { Nft as NftMeta } from 'config/constants/nfts/types'

// Collections -> Nfts -> Transactions
// Users -> Nft tokens IDs

// TODO: Handle the error state on the UI
export enum NFTMarketInitializationState {
  UNINITIALIZED,
  INITIALIZED,
  ERROR,
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

export interface NFT extends NftMeta {
  tokenId: BigNumberish
  metadataUrl: string
  transactionHistory: Transaction[]
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
  image: { original: string; thumbnail: string }
  owner: string
  // eslint-disable-next-line camelcase
  total_supply: BigNumberish
  verified: boolean
}

export interface User {
  address: string
  numberTokensListed: BigNumberish
  numberTokensPurchased: BigNumberish
  numberTokensSold: BigNumberish
  nfts: Record<string, BigNumberish> // String is an address, BigNumberish is a tokenID
}
