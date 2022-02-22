import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { useTable, ColumnType } from '@pancakeswap/uikit'
import TableHeader from '../../MigrationTable/TableHeader'
import Loading from '../../MigrationTable/Loading'
import EmptyText from '../../MigrationTable/EmptyText'
import TableStyle from '../../MigrationTable/StyledTable'
import Row, { RowProps } from './FarmRow'

const Container = styled.div`
  border-radius: 10px;
  overflow: hidden;
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
        {!userDataReady && <Loading />}
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
