import { Box, Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const StyledSwapContainer = styled(Flex)<{ $isChartExpanded: boolean }>`
  flex-shrink: 0;
  height: fit-content;
  padding: 0 16px;

  @media (max-width: 576px) {
    padding: 0;
  }
`

export const StyledInputCurrencyWrapper = styled(Box)`
  width: 440px;
  @media (max-width: 576px) {
    width: 100%;
  }
`
