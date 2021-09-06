import styled from 'styled-components'

const CollectionStatsWrapper = styled.div`
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
