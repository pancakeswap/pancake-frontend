import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { useTable, ColumnType } from '@pancakeswap/uikit'
import Row, { RowProps } from './Row'
import TableHeader from '../../MigrationTable/TableHeader'
import Loading from '../../MigrationTable/Loading'
import EmptyText from '../../MigrationTable/EmptyText'

export interface ITableProps {
  data: RowProps[]
  columns: ColumnType<RowProps>[]
  userDataReady: boolean
  sortColumn?: string
}

const Container = styled.div`
  filter: ${({ theme }) => theme.card.dropShadow};
  width: 100%;
  background: ${({ theme }) => theme.card.background};
  border-radius: 0 0 16px 16px;
  margin: 16px 0px;
  overflow: hidden;
`

const TableWrapper = styled.div`
  overflow: visible;
  scroll-margin-top: 64px;

  &::-webkit-scrollbar {
    display: none;
  }
`

const StyledTable = styled.table`
  border-collapse: collapse;
  font-size: 14px;
  border-radius: 4px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
`

const TableBody = styled.tbody`
  & tr {
    td {
      font-size: 16px;
      vertical-align: middle;
    }
  }
`

const TableContainer = styled.div`
  position: relative;
`

const Farm: React.FC<ITableProps> = (props) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { data, columns, userDataReady } = props
  const { rows } = useTable(columns, data, { sortable: true, sortColumn: 'farm' })

  return (
    <>
      <TableHeader title={t('Farms')} />
      <Container id="farms-table">
        <TableContainer>
          <TableWrapper>
            <StyledTable>
              <TableBody>
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
              </TableBody>
            </StyledTable>
          </TableWrapper>
        </TableContainer>
      </Container>
    </>
  )
}

export default Farm
