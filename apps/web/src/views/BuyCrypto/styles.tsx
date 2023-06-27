import { Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const StyledBuyCryptoContainer = styled(Flex)`
  flex-shrink: 0;
  height: fit-content;
  padding: 0 16px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0 40px;
  }
`

export const AppWrapper = styled.div`
  width: 370px;
`
