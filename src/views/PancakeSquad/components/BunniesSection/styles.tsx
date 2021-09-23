import { Box, Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const StyledBunnySectionContainer = styled(Flex)`
  position: relative;
  background: ${({ theme }) => theme.colors.gradients.bubblegum};
  padding-top: 40px;
`

export const StyledImageContainer = styled(Box)`
  z-index: 5;
`

export const StyledTextContainer = styled(Flex)`
  z-index: 5;
`
