import { CardBody, Flex, Heading, Image, ProfileAvatar } from '@pancakeswap/uikit'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { StyledCollectibleCard } from './styles'

interface HotCollectionCardProps {
  bgSrc: string
  avatarSrc?: string
  collectionName: string
  url: string
}

export const CollectionAvatar = styled(ProfileAvatar)`
  left: 0;
  position: absolute;
  top: -32px;
`

const StyledHotCollectionCard = styled(StyledCollectibleCard)`
  border-bottom-left-radius: 56px;

  & > div {
    border-bottom-left-radius: 56px;
  }
`

const HotCollectionCard: React.FC<HotCollectionCardProps> = ({ bgSrc, avatarSrc, collectionName, url, children }) => {
  return (
    <StyledHotCollectionCard>
      <Link to={url}>
        <CardBody p="8px">
          <Image src={bgSrc} height={125} width={375} />
          <Flex
            position="relative"
            height="65px"
            justifyContent="center"
            alignItems="flex-end"
            py="8px"
            flexDirection="column"
          >
            <CollectionAvatar src={avatarSrc} width={96} height={96} />
            <Heading as="h3" mb={children ? '8px' : '0'}>
              {collectionName}
            </Heading>
            {children}
          </Flex>
        </CardBody>
      </Link>
    </StyledHotCollectionCard>
  )
}

export default HotCollectionCard
