import { Box, Flex } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

export const StyledSwapContainer = styled(Flex)<{ $isChartExpanded: boolean }>`
  flex-shrink: 0;
  height: fit-content;
  padding: 0 16px;
`

export const StyledInputCurrencyWrapper = styled(Box)`
  width: 480px;
`
