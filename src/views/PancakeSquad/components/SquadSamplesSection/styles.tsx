import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'

export const StyledSquadSamplesContainer = styled(Flex)`
  position: relative;
  background: linear-gradient(180deg, #8051d6 0%, #492286 100%);
`

export const StyledSquadSamplesInnerContainer = styled(Flex)`
  max-width: 1200px;
  width: 100%;
  padding: 0 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0 40px;
  }
`
