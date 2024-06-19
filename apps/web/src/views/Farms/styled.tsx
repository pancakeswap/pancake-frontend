import { Flex, Heading } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const FarmFlexWrapper = styled(Flex)`
  flex-wrap: wrap;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-wrap: nowrap;
  }
`
export const FarmH1 = styled(Heading)`
  font-size: 32px;
  margin-bottom: 8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 64px;
    margin-bottom: 24px;
  }
`

export const FarmH2 = styled(Heading)`
  font-size: 16px;
  margin-bottom: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 24px;
    margin-bottom: 18px;
  }
`
