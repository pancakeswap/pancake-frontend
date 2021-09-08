import { Address, Images } from '../types'

export enum CollectionKey {
  PANCAKE = 'pancake',
  SQUAD = 'pancakeSquad',
}

export type Collection = {
  name: string
  description?: string
  slug: string
  address: Address
}

export type Collections = {
  [key in CollectionKey]: Collection
}

export type NftImages = {
  blur?: string
} & Images

export type Nft = {
  id: number | string
  name: string
  description: string
  images: NftImages
  video?: {
    webm: string
    mp4: string
  }

  // Uniquely identifies the nft.
  // Used for matching an NFT from the config with the data from the NFT's tokenURI
  identifier?: string

  attributes?: any
}

export type Nfts = {
  [key in CollectionKey]: Nft[]
}
