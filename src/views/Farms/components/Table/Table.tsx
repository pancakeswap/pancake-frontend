import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import { RowType, useTable, ChevronDownIcon } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js'
import useI18n from 'hooks/useI18n'

import Row, { RowData } from './Row'
import { ColumnsDef } from '../types'

export interface ITableProps {
  data: RowData[]
}

const Container = styled.div`
  padding: 1rem;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 0px 1px rgba(25, 19, 38, 0.15);
  border-radius: 32px;
  margin: 1rem 0rem;
  width: 100%;
  background: ${(props) => props.theme.card.background};

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 1.5rem;
  }
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
  font-size: 0.9rem;
  border-radius: 4px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
`

const TableBody = styled.tbody`
  & tr {
    td {
      font-size: 1rem;
      vertical-align: middle;
      padding-right: 1rem;

      &:first-child {
        position: sticky;
        left: 0;
        padding-right: 0;
        background: ${(props) => props.theme.card.background};

        > div {
          padding-right: 0;
        }
      }
    }
  }
`

const ArrowIcon = styled(ChevronDownIcon)`
  margin-left: 0.375rem;
  transition: 0.5s;

  &.toggle {
    transform: rotate(180deg);
  }
`

const TableContainer = styled.div`
  position: relative;
}
`

const columns = ColumnsDef.map((column) => ({
  id: column.id,
  name: column.name,
  label: column.normal,
  sort: (a: RowType<RowData>, b: RowType<RowData>) => {
    switch (column.name) {
      case 'farm':
        return a.id - b.id
      case 'apr':
        if (a.original.apr.value && b.original.apr.value) {
          return Number(a.original.apr.value) - Number(b.original.apr.value)
        }

        return 0
      case 'earned':
        return a.original.earned.earnings - b.original.earned.earnings
      default:
        return 1
    }
  },
  sortable: column.sortable,
}))

export default React.forwardRef((props: ITableProps) => {
  const scrollBarEl = useRef<HTMLDivElement>(null)
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const [tableWidth, setTableWidth] = useState(600)
  const [visibleScroll, setVisibleScroll] = useState(true)
  const [showGradient, setShowGradient] = useState(true)
  const TranslateString = useI18n()
  const { data } = props

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
      </TableContainer>
    </Container>
  )
})
