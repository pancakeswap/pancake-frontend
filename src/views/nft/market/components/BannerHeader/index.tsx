import React, { ReactNode } from 'react'
import { Flex, Box } from '@pancakeswap/uikit'
import AvatarImage from './AvatarImage'
import BannerImage from './BannerImage'
import CollectionStatsWrapper from './CollectionStatsWrapper'

interface HeaderProps {
  bannerImage: string
  bannerAlt?: string
  avatarImage: string
  avatarAlt?: string
  IconButtons: ReactNode
  TextContent: ReactNode
  CollectionStats: ReactNode
}

const Header: React.FC<HeaderProps> = ({
  bannerImage,
  bannerAlt,
  avatarImage,
  avatarAlt,
  IconButtons,
  TextContent,
  CollectionStats,
}) => {
  return (
    <Flex flexDirection="column">
      <Box position="relative">
        <BannerImage src={bannerImage} alt={bannerAlt} />
        <Box position="absolute" bottom={-68} left={-4}>
          <Flex alignItems="flex-end">
            <AvatarImage src={avatarImage} alt={avatarAlt} />
            {IconButtons}
          </Flex>
        </Box>
      </Box>
      <Flex flexDirection={['column', null, 'row']} justifyContent="space-between" mt={80}>
        {TextContent}
        <CollectionStatsWrapper>{CollectionStats}</CollectionStatsWrapper>
      </Flex>
    </Flex>
  )
}

export default Header
