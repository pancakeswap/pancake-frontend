import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { StyledCollectibleCard } from './styles'
import CardBody from './CardBody'
import { CollectibleCardProps } from './types'

const CollectibleLinkCard: React.FC<CollectibleCardProps> = ({ nft, nftLocation, currentAskPrice, ...props }) => {
  const { url } = useRouteMatch({ path: '/nfts' })

  return (
    <StyledCollectibleCard {...props}>
      <Link to={`${url}/collections/${nft.collectionAddress}/${nft.tokenId}`}>
        <CardBody nft={nft} nftLocation={nftLocation} currentAskPrice={currentAskPrice} />
      </Link>
    </StyledCollectibleCard>
  )
}

export default CollectibleLinkCard
