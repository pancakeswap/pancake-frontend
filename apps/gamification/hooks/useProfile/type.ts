import { Address } from 'viem'
import { NftAttribute, NftLocation, TokenMarketData } from 'views/ProfileCreation/Nft/type'

export interface Image {
  original: string
  thumbnail: string
  mp4?: string
  webm?: string
  gif?: string
}

export interface NftToken {
  tokenId: string
  name: string
  description: string
  collectionName: string
  collectionAddress: Address
  image: Image
  attributes?: NftAttribute[]
  createdAt?: string // API createdAt
  updatedAt?: string // API updatedAt
  marketData?: TokenMarketData
  location?: NftLocation
  meta?: Record<string, string | number>
}

export interface Profile {
  userId: number
  points: number
  teamId: number
  collectionAddress: Address
  tokenId: number
  isActive: boolean
  nft?: NftToken
}

export interface GetProfileResponse {
  profile?: Profile
  hasRegistered: boolean
}

export interface ContractProfileResponse {
  0: bigint
  1: bigint
  2: bigint
  3: Address
  4: bigint
  5: boolean
}

export interface ApiResponseSpecificToken {
  data: {
    attributes: NftAttribute[] | undefined
    tokenId: string
    name: string
    description: string
    image: Image
    createdAt: string
    updatedAt: string
    collection: {
      name: string
    }
  }
}
