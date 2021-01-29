import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import { RowType, useTable } from '@pancakeswap-libs/uikit'
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
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`

const StyledTable = styled.table`
  border-collapse: collapse;
  font-size: 0.9rem;
  overflow: hidden;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 0px 1px rgba(25, 19, 38, 0.15);
  border-radius: 4px;
  text-align: center;
`

const TableHead = styled.thead`
  & tr {
    background-color: ${(props) => props.theme.colors.tertiary};
    border-radius: 4px;
    color: #8f80ba;
    font-weight: 700;
    font-size: 0.75rem;
    text-transform: capitalize;
    cursor: pointer;

    & th {
      padding: 1px 15px;
      &:not(:first-child) {
        padding-left: 0px !important;
        padding-right: 0px !important;
        text-align: left;
      }
    }
  }

  & input {
    font-weight: 700;
    border: 1px solid #cccccc;
    border-radius: 10px;
    padding: 4px;
    width: 80%;
    outline-width: 0;
  }

  & .bold {
    color: #7645d9;
  }
`

const TableBody = styled.tbody`
  & tr {
    td {
      font-size: 0.875rem;
      vertical-align: middle;
      padding-right: 1rem;
    }
  }
`

const ArrowIcon = styled.img`
  margin-left: 0.375rem;
  transition: 0.5s;

  &.toggle {
    transform: rotate(180deg);
  }
`
const CellInner = styled.div`
  padding: 0.3125rem 0rem;
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 1rem;
`

const TableContainer = styled.div<{ showGradient: boolean }>`
  position: relative;
  &:after {
    transition: 0.3s;
    opacity: ${(props) => (props.showGradient ? '1' : '0')};
    display: block;
    content: "";
    width: 0.875rem;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    background: linear-gradient(270deg, #E9EAEB 0%, rgba(233, 234, 235, 0) 100%);
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
      case 'pool':
        return a.id - b.id
      case 'apy':
        if (a.original.apy.value && b.original.apy.value) {
          return Number(a.original.apy.value) - Number(b.original.apy.value)
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
  sortable: column.name !== 'links',
}))

export default React.forwardRef((props: ITableProps, ref) => {
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
        return <ArrowIcon src="/images/icons/arrow-down.svg" className="toggle" alt="arrow down" />
      }

      return <ArrowIcon src="/images/icons/arrow-down.svg" alt="arrow down" />
    }

    return null
  }

  const { headers, rows, toggleSort, setSearchString } = useTable(columns, data, { sortable: true })

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

  React.useImperativeHandle(ref, () => ({
    setTableQuery(query: string) {
      setSearchString(query)
    },
  }))

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
                    onClick={() => ((column.name !== 'links' && column.name !== 'tags') ? toggleSort(column.name) : '')}
                    isHeader
                  >
                    <CellInner>
                      <span className="bold">{ColumnsDef[key].bold}&nbsp;</span>
                      {TranslateString(ColumnsDef[key].translationId, column.label)}
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
