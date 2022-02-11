import { Box } from '@tovaswapui/uikit'
import styled from 'styled-components'

const IfoLayout = styled(Box)`
  > div:not(.sticky-header) {
    margin-bottom: 32px;
  }
`
export const IfoLayoutWrapper = styled(IfoLayout)`
  column-gap: 32px;
  display: grid;
  grid-template-columns: 1fr;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: minmax(300px, 1fr) minmax(462px, 2fr);
  }

  > div {
    margin: 0 auto;
    align-items: flex-start;
  }
`

export default IfoLayout
