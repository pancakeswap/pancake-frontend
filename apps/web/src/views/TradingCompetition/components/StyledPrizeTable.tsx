import { styled } from 'styled-components'

export const Td = styled.td`
  padding: 4px 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 8px;
  }
`

export const BoldTd = styled(Td)`
  font-weight: 600;
`

export const StyledPrizeTable = styled.table`
  width: 100%;

  th,
  td {
    text-align: center;
    vertical-align: middle;
  }

  & > thead th {
    font-size: 12px;
    padding: 16px 0;
    text-transform: uppercase;

    ${({ theme }) => theme.mediaQueries.xs} {
      padding: 16px 8px;
    }

    ${({ theme }) => theme.mediaQueries.sm} {
      padding: 16px;
    }
  }
`

export default StyledPrizeTable
