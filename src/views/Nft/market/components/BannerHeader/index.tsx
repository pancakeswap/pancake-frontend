import React, { ReactNode } from 'react'
import { Flex, Box } from '@pancakeswap/uikit'
import BannerImage from './BannerImage'
import CollectionStatsWrapper from './CollectionStatsWrapper'

interface HeaderProps {
  bannerImage: string
  bannerAlt?: string
  Avatar?: ReactNode
  IconButtons?: ReactNode
  TextContent?: ReactNode
  CollectionStats?: ReactNode
}

const Header: React.FC<HeaderProps> = ({
  bannerImage,
  bannerAlt,
  Avatar,
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
            {Avatar}
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
