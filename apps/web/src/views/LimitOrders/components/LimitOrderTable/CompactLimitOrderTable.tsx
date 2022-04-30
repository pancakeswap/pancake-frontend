import { memo } from 'react'
import styled from 'styled-components'
import { Table, Td } from '@pancakeswap/uikit'
import CompactRow from './CompactRow'

const RowStyle = styled.tr`
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundDisabled};
  }
`

const CompactLimitOrderTable = ({ orders }) => (
  <Table>
    <tbody>
      {orders.map((order) => (
        <RowStyle key={order.id}>
          <Td>
            <CompactRow order={order} />
          </Td>
        </RowStyle>
      ))}
    </tbody>
  </Table>
)

export default memo(CompactLimitOrderTable)
