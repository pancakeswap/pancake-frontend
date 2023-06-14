import { Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const ControlsContainer = styled(Flex).attrs({
  alignItems: 'center',
  justifyContent: 'space-between',
  flexDirection: 'column',
})`
  width: 100%;
  position: relative;

  margin-bottom: 2em;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 1em 2em;
    margin-bottom: 0;
  }
`
