import { NFT } from 'state/nftMarket/types'

// Temp
export interface Collectible {
  name: string
  cost: number
  lowestCost?: number
  nft: NFT
  status?: 'selling' | 'profile' | 'wallet'
}
