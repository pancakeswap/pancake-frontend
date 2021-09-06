import pancakeBunnies from './pancakeBunnies'
import pancakeSquad from './pancakeSquad'
import { CollectionKey, Nfts } from './types'

const nfts: Nfts = {
  [CollectionKey.PANCAKE]: pancakeBunnies,
  [CollectionKey.SQUAD]: pancakeSquad,
}

export default nfts
export { default as collections } from './collections'
