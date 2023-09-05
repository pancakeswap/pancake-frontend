import { Box, Flex } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

export const Wrapper = styled(Flex)`
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
`

export const StyledSwapContainer = styled(Flex)<{ $isChartExpanded: boolean }>`
  flex-shrink: 0;
  height: fit-content;
  padding: 0 12px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0 40px;
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    ${({ $isChartExpanded }) => ($isChartExpanded ? 'padding: 0 120px' : 'padding: 0 40px')};
  }
`

export const StyledInputCurrencyWrapper = styled(Box)`
  width: 328px;
`
