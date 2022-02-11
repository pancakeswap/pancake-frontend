import { Box, Flex } from '@tovaswapui/uikit'
import styled from 'styled-components'

export const StyledSquadContainer = styled(Box)`
  min-height: 100vh;
  background-color: #e6feff;
`

export const LandingBodyWrapper = styled(Flex)`
  max-width: 1200px;
  width: 100%;
  margin: 0 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    margin: 0 40px;
  }
`

export const StyledWaveContainer = styled(Box)`
  position: absolute;
  width: 100%;

  & > svg {
    max-height: 16px;
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 5;
  }
`
