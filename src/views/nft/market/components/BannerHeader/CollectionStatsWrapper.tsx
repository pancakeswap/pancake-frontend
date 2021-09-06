import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'

const CollectionStatsWrapper = styled(Flex)`
  justify-content: space-around;
  width: 100%;
  background: ${({ theme }) => theme.colors.invertedContrast};
  padding: 8px;
  border-radius: ${({ theme }) => theme.radii.card};
  border: 1px ${({ theme }) => theme.colors.cardBorder} solid;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 421px;
  }
`

export default CollectionStatsWrapper
