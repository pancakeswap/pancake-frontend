import { Flex } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

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

export const ControlGroup = styled(Flex)`
  width: 100%;
  align-items: ${(props) => props.alignItems || 'center'};
  flex-direction: ${(props) => props.flexDirection || 'row'};
  justify-content: ${(props) => props.justifyContent || 'space-between'};
  margin-bottom: 1em;

  &:last-child {
    margin-bottom: 0;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    margin-bottom: 0;
  }
`
