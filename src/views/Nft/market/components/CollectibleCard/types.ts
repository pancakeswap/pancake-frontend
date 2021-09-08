import { Nft } from 'config/constants/nfts/types'

// Temp
export interface Collectible {
  name: string
  cost: number
  lowestCost?: number
  nft: Nft
  status?: 'selling' | 'profile' | 'wallet'
}
