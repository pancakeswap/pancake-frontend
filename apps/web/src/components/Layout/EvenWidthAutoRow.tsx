import { AutoRow } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

export const EvenWidthAutoRow = styled(AutoRow)`
  & > * {
    flex: 1;
  }
`
