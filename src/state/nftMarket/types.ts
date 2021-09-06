import { BigNumberish } from 'ethers'

// Collections -> Nfts -> Transactions
// Users -> Nft tokens IDs

export interface State {
  collections: Collection[]
  users: User[]
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

export interface NFT {
  tokenId: BigNumberish
  metadataUrl: string
  name: string
  description: string
  visual: string[]
  attributes: { name: string; value: string }[]
  transactionHistory: Transaction[]
}

export interface Collection {
  address: string
  name: string
  symbol: string
  active: boolean
  totalTrades: BigNumberish
  totalVolumeBNB: BigNumberish
  numberTokensListed: BigNumberish
  nfts: NFT[]
  creatorAddress: string
  tradingFee: BigNumberish
  creatorFee: BigNumberish
  whitelistChecker: string
}

export interface User {
  address: string
  numberTokensListed: BigNumberish
  numberTokensPurchased: BigNumberish
  numberTokensSold: BigNumberish
  nfts: { [collectionAddress: string]: BigNumberish[] } // List of tokens IDs
}
