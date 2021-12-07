import { Box } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const StyledPriceChart = styled(Box)<{ $isDark: boolean; $isExpanded: boolean }>`
  border: none;
  border-radius: 32px;
  width: 100%;
  padding-top: 36px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 8px;
    background: ${({ $isDark }) => ($isDark ? 'rgba(39, 38, 44, 0.5)' : 'rgba(255, 255, 255, 0.5)')};
    border: ${({ theme }) => `1px solid ${theme.colors.cardBorder}`};
    border-radius: ${({ $isExpanded }) => ($isExpanded ? '0' : '16px')};
    width: ${({ $isExpanded }) => ($isExpanded ? '100%' : '50%')};
    height: ${({ $isExpanded }) => ($isExpanded ? 'calc(100vh - 100px)' : '516px')};
  }
`

StyledPriceChart.defaultProps = {
  height: '70%',
}
