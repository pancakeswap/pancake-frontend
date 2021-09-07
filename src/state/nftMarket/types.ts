import { BigNumberish } from 'ethers'

// Collections -> Nfts -> Transactions
// Users -> Nft tokens IDs

export interface State {
  data: {
    collections: Collection[]
    users: User[]
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
  id: string
  name: string
  symbol: string
  active: boolean
  totalVolumeBNB: BigNumberish
  numberTokensListed: BigNumberish
  tradingFee: BigNumberish
  creatorFee: BigNumberish
  nfts: NFT[]
}

export interface User {
  address: string
  numberTokensListed: BigNumberish
  numberTokensPurchased: BigNumberish
  numberTokensSold: BigNumberish
  nfts: { [collectionAddress: string]: BigNumberish[] } // List of tokens IDs
}
