import { Box, Flex } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

export const StyledSwapContainer = styled(Flex)`
  flex-shrink: 0;
  height: fit-content;
  padding: 0 16px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0 40px;
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    padding: 0 40px;
  }
`

export const StyledInputCurrencyWrapper = styled(Box)`
  width: 328px;
`
