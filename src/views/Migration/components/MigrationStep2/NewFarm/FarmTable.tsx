import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { useTable, ColumnType, Flex, Spinner } from '@pancakeswap/uikit'
import TableHeader from '../../MigrationTable/TableHeader'
import EmptyText from '../../MigrationTable/EmptyText'
import TableStyle from '../../MigrationTable/StyledTable'
import Row, { RowProps } from './FarmRow'

const Container = styled.div`
  overflow: hidden;
  margin-bottom: 32px;
  border-radius: 24px 24px 16px 16px;
  background-color: ${({ theme }) => theme.colors.disabled};
  padding: 1px 1px 3px 1px;
`

export interface ITableProps {
  account: string
  data: RowProps[]
  columns: ColumnType<RowProps>[]
  userDataReady: boolean
  sortColumn?: string
}

const FarmTable: React.FC<ITableProps> = ({ account, data, columns, userDataReady }) => {
  const { t } = useTranslation()
  const { rows } = useTable(columns, data, { sortable: true, sortColumn: 'farm' })

  return (
    <Container>
      <TableHeader title={t('Farms')} />
      <TableStyle>
        {!userDataReady && (
          <Flex padding="50px 10px" justifyContent="center">
            <Spinner />
          </Flex>
        )}
        {!account && <EmptyText text={t('Please connect wallet to check your farms status.')} />}
        {account && userDataReady && rows.length === 0 && (
          <EmptyText text={t('You are not currently staking in any farms.')} />
        )}
        {account &&
          userDataReady &&
          rows.map((row) => {
            return <Row {...row.original} key={`table-row-${row.id}`} />
          })}
      </TableStyle>
    </Container>
  )
}

export default FarmTable
