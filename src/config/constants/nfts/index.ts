import pancakeBunnies from './pancakeBunnies'
import { CollectionKey, Nfts } from './types'

const nfts: Nfts = {
  [CollectionKey.PANCAKE]: pancakeBunnies,
}

export default nfts
export { default as collections } from './collections'
