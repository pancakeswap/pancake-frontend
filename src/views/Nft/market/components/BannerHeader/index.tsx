import React, { ReactNode } from 'react'
import { Flex, Box, FlexProps } from '@pancakeswap/uikit'
import BannerImage from './BannerImage'

interface BannerHeaderProps extends FlexProps {
  bannerImage: string
  bannerAlt?: string
  avatar?: ReactNode
}

const BannerHeader: React.FC<BannerHeaderProps> = ({ bannerImage, bannerAlt, avatar, children, ...props }) => {
  return (
    <Flex flexDirection="column" mb="24px" {...props}>
      <Box position="relative" pb="56px">
        <BannerImage src={bannerImage} alt={bannerAlt} />
        <Box position="absolute" bottom={0} left={-4}>
          <Flex alignItems="flex-end">
            {avatar}
            {children}
          </Flex>
        </Box>
      </Box>
    </Flex>
  )
}

export default BannerHeader
