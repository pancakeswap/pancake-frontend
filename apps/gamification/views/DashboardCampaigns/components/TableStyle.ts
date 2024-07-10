import { Flex } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

export const BaseCell = styled(Flex)`
  color: black;
  padding: 24px 8px;
  flex-direction: column;
  justify-content: flex-start;
`

export const StyledCell = styled(BaseCell)`
  flex-direction: row;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 20px 8px;
  }
`
