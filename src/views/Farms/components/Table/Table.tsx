import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import { RowType, useTable, ChevronDownIcon } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js'
import useI18n from 'hooks/useI18n'

import Row, { RowData } from './Row'
import ScrollBar from '../ScrollBar'
import { ColumnsDef } from '../types'
import Cell from '../Cell'

export interface ITableProps {
  data: RowData[]
}

const Container = styled.div`
  padding: 16px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 0px 1px rgba(25, 19, 38, 0.15);
  border-radius: 32px;
  margin: 16px 0px;
  width: 100%;
  background: ${(props) => props.theme.card.background};

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 24px;
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
  font-size: 14px;
  border-radius: 4px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
`

const TableHead = styled.thead`
  & tr {
    background-color: ${(props) => props.theme.colors.tertiary};
    border-radius: 4px;
    color: ${(props) => props.theme.colors.textSubtle};
    font-weight: 700;
    font-size: 12px;
    text-transform: capitalize;
    cursor: pointer;

    & th {
      background-color: ${(props) => props.theme.colors.tertiary};
      position: sticky;
      top: 0;
      padding: 1px 0px;
      z-index: 100;

      &:first-child {
        padding-right: 13px;
      }
    }
  }

  & .bold {
    color: #7645d9;
  }
`

const TableBody = styled.tbody`
  & tr {
    td {
      font-size: 14px;
      vertical-align: middle;
      padding-right: 16px;

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
  margin-left: 6px;
  transition: 0.5s;

  &.toggle {
    transform: rotate(180deg);
  }
`
const CellInner = styled.div`
  padding: 5px 0px;
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 16px;
`

const TableContainer = styled.div<{ showGradient: boolean }>`
  position: relative;
  &:after {
    transition: 0.3s;
    opacity: ${(props) => (props.showGradient ? '1' : '0')};
    display: block;
    content: "";
    width: 14px;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    background: linear-gradient(270deg, #E9EAEB 0%, rgba(233, 234, 235, 0) 100%);
    z-index: 100;

  }
  ${({ theme }) => theme.mediaQueries.sm} {
    &:after {
      display: none;
    }
  }
}
`

const columns = ColumnsDef.map((column) => ({
  id: column.id,
  name: column.name,
  label: column.normal,
  sort: (a: RowType<RowData>, b: RowType<RowData>) => {
    switch (column.name) {
      case 'farm':
        return b.id - a.id
      case 'apr':
        if (a.original.apr.value && b.original.apr.value) {
          return Number(a.original.apr.value) - Number(b.original.apr.value)
        }

        return 0
      case 'details':
        if (a.original.details.liquidity && b.original.details.liquidity) {
          return a.original.details.liquidity - b.original.details.liquidity
        }

        return 0
      case 'earned':
        return a.original.earned.earnings - b.original.earned.earnings
      case 'staked':
        if (a.original.staked.userData && b.original.staked.userData) {
          return new BigNumber(a.original.staked.userData.stakedBalance).comparedTo(
            new BigNumber(b.original.staked.userData.stakedBalance),
          )
        }

        return 0
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
      let isBarScrolling = false
      let isTableScrolling = false
      scrollBarEl.current.onscroll = (): void => {
        if (tableWrapperEl.current) {
          if (isTableScrolling) {
            isTableScrolling = false
            return
          }
          isBarScrolling = true

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
          if (isBarScrolling) {
            isBarScrolling = false
            return
          }
          isTableScrolling = true

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
      {visibleScroll && <ScrollBar ref={scrollBarEl} width={tableWidth} />}
      <TableContainer showGradient={showGradient}>
        <TableWrapper ref={tableWrapperEl}>
          <StyledTable>
            <TableHead>
              <tr>
                {headers.map((column, key) => (
                  <Cell
                    key={`head-${column.name}`}
                    onClick={() => (ColumnsDef[key].sortable ? toggleSort(column.name) : '')}
                    isHeader
                  >
                    <CellInner>
                      <span className="bold">{ColumnsDef[key].bold}&nbsp;</span>
                      {TranslateString(ColumnsDef[key].translationId, ColumnsDef[key].normal)}
                      {renderSortArrow(column)}
                    </CellInner>
                  </Cell>
                ))}
              </tr>
            </TableHead>
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
