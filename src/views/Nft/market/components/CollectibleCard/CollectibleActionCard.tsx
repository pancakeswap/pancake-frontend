import React from 'react'
import { StyledCollectibleCard } from './styles'
import CardBody from './CardBody'
import { CollectibleCardProps } from './types'

const CollectibleActionCard: React.FC<CollectibleCardProps> = ({ nft, nftLocation, currentAskPrice, ...props }) => {
  return (
    <StyledCollectibleCard {...props}>
      <CardBody nft={nft} nftLocation={nftLocation} currentAskPrice={currentAskPrice} />
    </StyledCollectibleCard>
  )
}

export default CollectibleActionCard
