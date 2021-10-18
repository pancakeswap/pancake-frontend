import { Box } from '@pancakeswap/uikit'
import styled, { css } from 'styled-components'

export const StyledPriceChart = styled(Box)<{ $isDark: boolean; $isExpanded: boolean }>`
  background: ${({ $isDark }) => ($isDark ? 'rgba(39, 38, 44, 0.5)' : 'rgba(255, 255, 255, 0.5)')};
  border: ${({ theme }) => `1px solid ${theme.colors.cardBorder}`};
  border-radius: ${({ $isExpanded }) => ($isExpanded ? '0' : '16px')};
  width: ${({ $isExpanded }) => ($isExpanded ? '100%' : '50%')};
  height: ${({ $isExpanded }) => ($isExpanded ? 'calc(100vh - 100px)' : '100%')};
  display: none;

  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
  }
`

const UnstyledButton = css`
  border: none;
  cursor: pointer;
  background: none;
  line-height: 1;
`

export const StyledSwapButton = styled.button`
  ${UnstyledButton}
  color: ${({ theme }) => theme.colors.secondary};
`

export const StyledExpandButton = styled.button`
  ${UnstyledButton}
`
