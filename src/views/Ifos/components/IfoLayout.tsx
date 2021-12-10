import { Box } from '@pancakeswap/uikit'
import styled from 'styled-components'

const IfoLayout = styled(Box)`
  display: grid;
  grid-gap: 32px;
  padding: 40px 0;
`
export const IfoLayoutWrapper = styled.div`
  gap: 32px;
  display: grid;
  grid-template-columns: 1fr;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: minmax(300px, 1fr) minmax(462px, 2fr);
  }

  > div {
    margin: 0 auto;
  }
`

export default IfoLayout
