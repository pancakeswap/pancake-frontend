import { TokenMarketData, Image } from 'state/nftMarket/types'

export enum PaymentCurrency {
  BNB,
  WBNB,
}

export enum BuyingStage {
  REVIEW,
  APPROVE_AND_CONFIRM,
  CONFIRM,
  TX_CONFIRMED,
}

export interface BuyNFT {
  collection: {
    address: string
    name: string
  }
  token: TokenMarketData
  name: string
  image: Image
}
