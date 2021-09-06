import { Collectible } from '../components/CollectibleCard/types'

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
