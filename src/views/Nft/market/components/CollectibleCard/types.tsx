import { CardProps } from '@pancakeswap/uikit'
import { NFT, NftLocation } from 'state/nftMarket/types'

export interface CollectibleCardProps extends CardProps {
  nft: NFT
  nftLocation?: NftLocation
  currentAskPrice?: number
}
