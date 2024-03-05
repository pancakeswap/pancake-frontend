import { Box } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

export const GradientBox = styled(Box)`
  border-radius: 24px 24px 0 0;
  height: 120px;
  background: ${({ theme }) =>
    `linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, ${
      theme.isDark ? 'rgba(32, 28, 41, 0.5) 100%)' : 'rgba(255, 255, 255, 0.8) 100%)'
    }`};
`
