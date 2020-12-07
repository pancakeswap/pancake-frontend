import styled from 'styled-components'
import { BaseLayout } from '@pancakeswap-libs/uikit'

const NftGrid = styled(BaseLayout)`
  padding-bottom: 24px;
  padding-top: 24px;

  & > div {
    grid-column: 2 / 6;

    ${({ theme }) => theme.mediaQueries.sm} {
      grid-column: span 4;
    }
  }
`

export default NftGrid
