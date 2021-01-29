import React from 'react'
import styled from 'styled-components'
import { Heading, Text } from '@pancakeswap-libs/uikit'
import { Nft } from 'config/constants/types'

interface CollectibleCardProps {
  nft: Nft
}

const PreviewImage = styled.img`
  border-radius: 4px;
  margin-bottom: 8px;
`

const CollectibleCard: React.FC<CollectibleCardProps> = ({ nft }) => {
  return (
    <div>
      <PreviewImage src={`/images/nfts/${nft.previewImage}`} />
      <Heading as="h5" size="sm" mb="8px">
        {nft.name}
      </Heading>
      <Text as="p" fontSize="12px" color="textSubtle">
        {nft.description}
      </Text>
    </div>
  )
}

export default CollectibleCard
