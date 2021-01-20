import React, { useRef, useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import { Button, useTable } from '@pancakeswap-libs/uikit'
import HarvestButton from 'views/Pools/components/HarvestButton'
import { Link } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { QuoteToken } from 'config/constants/types'
import { usePriceBnbBusd, usePriceCakeBusd } from 'state/hooks'

import Row from './Row'
import ScrollBar from '../ScrollBar'
import { columnsDef, tempData } from "../temp";
import Cell from "../Cell";
import { TableDataTypes } from '../types';
import { FarmWithStakedValue } from '../FarmCard'

export interface ITableProps {
  data: FarmWithStakedValue[]
}

const Container = styled.div`
  padding: 24px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 0px 1px rgba(25, 19, 38, 0.15);
  border-radius: 32px;
  margin: 1rem 0rem;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledTable = styled.table`
  border-collapse: collapse;
  min-width: 800px;
  font-size: 0.9rem;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 0px 1px rgba(25, 19, 38, 0.15);
  border-radius: 4px;
  text-align: center;
`;

const TableHead = styled.thead`
  & tr {
    background-color: #eff4f5;
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
`;

const TableBody = styled.tbody`
  & tr {
    border-bottom: 1px solid #dddddd;

    td {
      font-size: 0.875rem;
      vertical-align: middle;
      padding-right: 1rem;
    }
  }
`;

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

const columns = columnsDef.map((column => ({
  id: column.id,
  name: column.normal.toLowerCase(),
  label: column.normal
})));

export default React.forwardRef((props: ITableProps, ref) => {
  const scrollBarEl = useRef<HTMLDivElement>(null)
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const [tableWidth, setTableWidth] = useState(600)
  const [visibleScroll, setVisibleScroll] = useState(true)
  const { data } = props
  const cakePrice = usePriceCakeBusd()
  const bnbPrice = usePriceBnbBusd()

  const rowData = useMemo(() => {
    return data.map((farm) => {
      const row: any = {}
      let totalValue = farm.lpTotalInQuoteToken

      if (!farm.lpTotalInQuoteToken) {
        totalValue = null
      }
      if (farm.quoteTokenSymbol === QuoteToken.BNB) {
        totalValue = bnbPrice.times(farm.lpTotalInQuoteToken)
      }
      if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
        totalValue = cakePrice.times(farm.lpTotalInQuoteToken)
      }

      const totalValueFormated = totalValue
        ? `$${Number(totalValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
        : '-'

      row.apy = {
        value: farm.apy ? `${farm.apy.times(new BigNumber(100)).toNumber().toLocaleString('en-US').slice(0, -1)}%` : 'Loading ...',
        multiplier: farm.multiplier
      }

      row.pool = {
        image: farm.lpSymbol.split(' ')[0].toLocaleLowerCase(),
        label: farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('PANCAKE', '')
      }

      row.earned = {

      }

      row.staked = {

      }

      row.details = {
        liquidity: totalValueFormated
      }

      row.links = {
        bsc: farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]
      }

      return row
    })
  }, [data, bnbPrice, cakePrice])

  useEffect(() => {
    scrollBarEl.current.onscroll = (): void => {
      if (tableWrapperEl.current && scrollBarEl.current)
        tableWrapperEl.current.scrollLeft = scrollBarEl.current.scrollLeft;
    };


    if (scrollBarEl.current.clientWidth + 24 >= tableWrapperEl.current.scrollWidth) {
      setVisibleScroll(false);
    }
    setTableWidth(tableWrapperEl.current.scrollWidth);
  }, []);

  const renderSortArrow = (column: any): JSX.Element => {
    if (column.sorted && column.sorted.on)  {
      if (column.sorted.asc) {
        return (
          <ArrowIcon
            src="/images/icons/arrow-down.svg"
            className="toggle"
            alt="arrow down"
          />
        );
      }

      return (
        <ArrowIcon
          src="/images/icons/arrow-down.svg"
          alt="arrow down"
        />
      );
    }

    return null;
  }

  const { headers, rows, toggleSort, setSearchString  } = useTable(columns, rowData, { sortable: true });

  React.useImperativeHandle(ref, () => ({
    setTableQuery(query: string) {
      setSearchString(query);
    }
  }));
  console.log('ggggggggggggggggggggggg')
  return (
    <Container>
      {
        visibleScroll &&
          <ScrollBar ref={scrollBarEl} width={ tableWidth } />
      }
      <TableWrapper ref={tableWrapperEl}>
        <StyledTable>
          <TableHead>
            <tr>
              {headers.map((column, key) => (
                <Cell
                  key={`head-${column.name}`}
                  onClick={() => toggleSort(column.name) }
                  isHeader
                >
                  <CellInner>
                    <span className="bold">{columnsDef[key].bold}&nbsp;</span>
                    {column.label}
                    {
                      renderSortArrow(column)
                    }
                  </CellInner>
                </Cell>
              ))}
            </tr>
          </TableHead>
          <TableBody>
          {
            rows.map((row) => {
              return (
                <Row data={row.original} />
            )})
          }
          </TableBody>
        </StyledTable>
      </TableWrapper>
    </Container>
  );
});
