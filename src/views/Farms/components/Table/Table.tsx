import React, { useRef } from 'react'
import styled from 'styled-components'
import { useTable, Button, ChevronUpIcon, ColumnType } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

import Row, { RowData } from './Row'

export interface ITableProps {
  data: RowData[]
  columns: ColumnType<RowData>[]
}

const Container = styled.div`
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 0px 1px rgba(25, 19, 38, 0.15);
  margin: 16px 0px;
  width: 100%;
  background: ${(props) => props.theme.card.background};
`

const TableWrapper = styled.div`
  overflow: auto;
  max-height: 600px;

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
    border-bottom: 2px solid ${(props) => props.theme.colors.borderColor};

    td {
      font-size: 16px;
      vertical-align: middle;
    }
  }
`

const TableContainer = styled.div`
  position: relative;
}
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

export default React.forwardRef((props: ITableProps) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const TranslateString = useI18n()
  const { data, columns } = props

  const { rows } = useTable(columns, data, { sortable: true, sortColumn: 'farm' })

  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <Container>
      <TableContainer>
        <TableWrapper ref={tableWrapperEl}>
          <StyledTable>
            <TableBody>
              {rows.map((row) => {
                return <Row {...row.original} key={`table-row-${row.id}`} />
              })}
            </TableBody>
          </StyledTable>
        </TableWrapper>
        <ScrollButtonContainer>
          <Button variant="text" onClick={scrollToTop}>
            {TranslateString(999, 'To Top')}
            <ChevronUpIcon color="primary" />
          </Button>
        </ScrollButtonContainer>
      </TableContainer>
    </Container>
  )
})
