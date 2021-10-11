import { Box } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const StyledPriceChart = styled(Box)<{ $isDark: boolean }>`
  background: ${({ $isDark }) => ($isDark ? 'rgba(39, 38, 44, 0.5)' : 'rgba(255, 255, 255, 0.5)')};
  border: ${({ theme }) => `1px solid ${theme.colors.cardBorder}`};
  border-radius: 16px;
`

export const StyledSwapButton = styled.button`
  border: none;
  cursor: pointer;
  background: none;
  color: ${({ theme }) => theme.colors.secondary};
  line-height: 1;
`
