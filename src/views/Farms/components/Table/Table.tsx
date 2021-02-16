import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useTable, ChevronDownIcon, Button, ChevronUpIcon, ColumnType } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

import Row, { RowData } from './Row'
import { DesktopColumnSchema, MobileColumnSchema } from '../types'

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

const ArrowIcon = styled(ChevronDownIcon)`
  margin-left: 6px;
  transition: 0.5s;

  &.toggle {
    transform: rotate(180deg);
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
  const scrollBarEl = useRef<HTMLDivElement>(null)
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const [tableWidth, setTableWidth] = useState(600)
  const [visibleScroll, setVisibleScroll] = useState(true)
  const [showGradient, setShowGradient] = useState(true)
  const TranslateString = useI18n()
  const { data, columns } = props

  const renderSortArrow = (column: any): JSX.Element => {
    if (column.sorted && column.sorted.on) {
      if (column.sorted.asc) {
        return <ArrowIcon className="toggle" color="secondary" />
      }

      return <ArrowIcon color="secondary" />
    }

    return null
  }

  const { headers, rows, toggleSort } = useTable(columns, data, { sortable: true, sortColumn: 'farm' })

  useEffect(() => {
    if (scrollBarEl && scrollBarEl.current) {
      let isScrolling1 = false
      let isScrolling2 = false
      scrollBarEl.current.onscroll = (): void => {
        if (tableWrapperEl.current) {
          if (isScrolling2) {
            isScrolling2 = false
            return
          }
          isScrolling1 = true

          if (!scrollBarEl.current.scrollLeft) {
            tableWrapperEl.current.scrollLeft = scrollBarEl.current.scrollLeft
            return
          }

          const scrollPercent =
            (scrollBarEl.current.scrollLeft + scrollBarEl.current.clientWidth) / scrollBarEl.current.scrollWidth
          setShowGradient(scrollPercent !== 1)
          tableWrapperEl.current.scrollLeft =
            scrollPercent * tableWrapperEl.current.scrollWidth - tableWrapperEl.current.clientWidth
        }
      }

      tableWrapperEl.current.onscroll = (): void => {
        if (scrollBarEl.current) {
          if (isScrolling1) {
            isScrolling1 = false
            return
          }
          isScrolling2 = true

          if (!tableWrapperEl.current.scrollLeft) {
            scrollBarEl.current.scrollLeft = tableWrapperEl.current.scrollLeft
            return
          }
          const scrollPercent =
            (tableWrapperEl.current.scrollLeft + tableWrapperEl.current.clientWidth) /
            tableWrapperEl.current.scrollWidth
          setShowGradient(scrollPercent !== 1)
          scrollBarEl.current.scrollLeft =
            scrollPercent * scrollBarEl.current.scrollWidth - scrollBarEl.current.clientWidth
        }
      }

      if (scrollBarEl.current.clientWidth + 24 >= tableWrapperEl.current.scrollWidth) {
        setVisibleScroll(false)
      }
      setTableWidth(tableWrapperEl.current.scrollWidth)
    }
  }, [])

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
