import { Nft } from 'config/constants/nfts/types'

// Temp
export interface Collectible {
  name: string
  cost: number
  lowestCost?: number
  nft: Nft
  status?: 'selling' | 'profile' | 'wallet'
}

export enum NFTLocation {
  FOR_SALE = 'For Sale',
  IN_WALLET = 'In Wallet',
  PROFILE_PIC = 'Profile Pic',
}

export type UserCollectibles = {
  [NFTLocation.FOR_SALE]: Collectible[]
  [NFTLocation.IN_WALLET]: Collectible[]
  [NFTLocation.PROFILE_PIC]: Collectible[]
}

export interface CollectibleAndOwnerData {
  owner: {
    account: string
    profileName: string
  }
  collectible: Collectible
}
