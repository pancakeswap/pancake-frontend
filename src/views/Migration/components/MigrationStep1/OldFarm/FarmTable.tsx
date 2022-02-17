import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { useTable, ColumnType } from '@pancakeswap/uikit'
import Row, { RowProps } from './FarmRow'
import TableHeader from '../../MigrationTable/TableHeader'
import Loading from '../../MigrationTable/Loading'
import EmptyText from '../../MigrationTable/EmptyText'
import TableStyle from '../../MigrationTable/StyledTable'

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
    <>
      <TableHeader title={t('Old Farms')} />
      <TableStyle>
        {!userDataReady && <Loading />}
        {!account && <EmptyText text={t('Please connect wallet to check your farms status.')} />}
        {account && userDataReady && rows.length === 0 && (
          <EmptyText text={t('You are not currently staking in any v1 farms.')} />
        )}
        {account &&
          userDataReady &&
          rows.map((row) => {
            return <Row {...row.original} userDataReady={userDataReady} key={`table-row-${row.id}`} />
          })}
      </TableStyle>
    </>
  )
}

export default FarmTable
