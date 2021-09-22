import { CardProps } from '@pancakeswap/uikit'
import { PancakeBunnyNftWithTokens, NftLocation } from 'state/nftMarket/types'

export interface CollectibleCardProps extends CardProps {
  nft: PancakeBunnyNftWithTokens
  nftLocation?: NftLocation
  currentAskPrice?: number
}
