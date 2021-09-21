import React from 'react'
import { StyledCollectibleCard } from './styles'
import CardBody from './CardBody'
import { CollectibleCardProps } from './types'

const CollectibleActionCard: React.FC<CollectibleCardProps> = ({
  nft,
  nftLocation,
  currentAskPrice,
  lowestPrice,
  ...props
}) => {
  return (
    <StyledCollectibleCard {...props}>
      <CardBody nft={nft} nftLocation={nftLocation} currentAskPrice={currentAskPrice} lowestPrice={lowestPrice} />
    </StyledCollectibleCard>
  )
}

export default CollectibleActionCard
