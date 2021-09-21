import React from 'react'
import { Link } from 'react-router-dom'
import { StyledCollectibleCard } from './styles'
import CardBody from './CardBody'
import { CollectibleCardProps } from './types'
import { nftsBaseUrl } from '../../constants'

const CollectibleLinkCard: React.FC<CollectibleCardProps> = ({ nft, nftLocation, currentAskPrice, ...props }) => {
  return (
    <StyledCollectibleCard {...props}>
      <Link to={`${nftsBaseUrl}/collections/${nft.collectionAddress}/${nft.tokenId}`}>
        <CardBody nft={nft} nftLocation={nftLocation} currentAskPrice={currentAskPrice} />
      </Link>
    </StyledCollectibleCard>
  )
}

export default CollectibleLinkCard
