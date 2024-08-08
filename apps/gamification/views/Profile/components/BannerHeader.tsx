import { Box, Flex, FlexProps } from '@pancakeswap/uikit'
import Image from 'next/image'
import { ReactNode } from 'react'
import { styled } from 'styled-components'

const StyledBannerImageWrapper = styled.div`
  ${({ theme }) => `background-color: ${theme.colors.cardBorder}`};
  flex: none;
  position: relative;
  width: 100%;
  border-radius: 32px;
  height: 123px;
  overflow: hidden;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 192px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    height: 256px;
  }
`

interface BannerHeaderProps extends FlexProps {
  bannerImage: string
  bannerAlt?: string
  avatar?: ReactNode
}

export const BannerHeader: React.FC<React.PropsWithChildren<BannerHeaderProps>> = ({
  bannerImage,
  bannerAlt,
  avatar,
  children,
  ...props
}) => {
  return (
    <Flex flexDirection="column" mb="24px" {...props}>
      <Box position="relative" pb="56px">
        <StyledBannerImageWrapper>
          <Image src={bannerImage} alt={bannerAlt ?? ''} fill style={{ objectFit: 'cover' }} priority />
        </StyledBannerImageWrapper>
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
