import pancakeBunnies from 'config/constants/nfts/pancakeBunnies'
import { Collectible } from '../components/CollectibleCard/types'

export const example1: Collectible = {
  name: 'Pancake Bunnies',
  cost: 1.5,
  nft: pancakeBunnies[1],
  status: 'profile',
}

export const example2: Collectible = {
  name: 'Pancake Bunnies',
  cost: 12.55,
  lowestCost: 6.28,
  nft: pancakeBunnies[4],
  status: 'selling',
}

export const example3: Collectible = {
  name: 'Pancake Bunnies',
  cost: 0.01,
  lowestCost: 0.0019,
  nft: pancakeBunnies[3],
  status: 'wallet',
}
