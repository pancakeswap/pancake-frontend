import { styled } from 'styled-components'

export const StyledTr = styled.tr`
  cursor: pointer;
  &:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
  }
`

export const CellInner = styled.div`
  padding: 24px 0px;
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 8px;

  ${({ theme }) => theme.mediaQueries.xl} {
    padding-right: 32px;
  }
`

export const EarnedMobileCell = styled.td`
  padding: 16px 0 24px 16px;
`

export const AprMobileCell = styled.td`
  padding-top: 16px;
  padding-bottom: 24px;
`

export const FarmMobileCell = styled.td`
  padding-top: 24px;
`
