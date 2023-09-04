import React from 'react'
import { styled } from 'styled-components'

const StyledTable = styled.div`
  border-radius: 0px 0px 16px 16px;

  background-color: ${({ theme }) => theme.card.background};
  > div:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
  }

  > div:last-child {
    border-radius: 0px 0px 16px 16px;
  }
`

const TableStyle: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <StyledTable role="table">{children}</StyledTable>
}

export default TableStyle
