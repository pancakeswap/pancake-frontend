import { Address } from 'viem'

export interface Image {
  original: string
  thumbnail: string
  mp4?: string
  webm?: string
  gif?: string
}

export interface NftToken {
  image: Image
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
