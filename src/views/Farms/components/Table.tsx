import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Button, HeaderType, useTable } from '@pancakeswap-libs/uikit'
import HarvestButton from 'views/Pools/components/HarvestButton';
import { Link } from 'react-router-dom';

import ScrollBar from './ScrollBar'
import { columnsDef, tempData } from "./temp";
import Cell from "./Cell";
import { TableDataTypes } from './types';

export interface ITableProps {
  data: string[]
}

const Container = styled.div`
  padding: 24px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 0px 1px rgba(25, 19, 38, 0.15);
  border-radius: 32px;
  max-width: 500px;
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
    text-transform: capitalize;
    cursor: pointer;

    & th {
      padding: 0px 15px;
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

const BnbIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.5rem;
`;

const CellInner = styled.div`
  padding: 0.5rem 0rem;
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 1rem;
`;

const CalculateIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;
const MultiplyBadge = styled.div`
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 1rem;
  color: white;
  padding: 0.375rem 0.5rem;
`;

const ConnectWalletButton = styled(Button)`
  background: ${({ theme }) => theme.colors.primary};
  border-width: 0;
  color: white;
  height: 2rem;
  width: 10rem;
  border-radius: 1rem;
  padding-left: 0;
  padding-right: 0;
`;

const DetailsContainer = styled.div`
  text-align: left;
  & div {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;

    & span {
      display: flex;
      align-items: center;
    }
  }
`;

const StakeLabel = styled.span`
  color: ${({ theme }) => theme.colors.text};
  margin-right: 0.5rem;
`;

const OpenIcon = styled.img`
  width: 1rem;
  height: 1rem;
`;

const StakeTitle = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  white-space: nowrap;
`;

const LinkContainer = styled.div`
  display: block;
  text-align: left;

  & a {
    color: ${({ theme }) => theme.colors.primary};
    white-space: nowrap;
    display: block;
  }
`
const Earned = styled.span`
  margin-right: 3rem;
`;

const ArrowIcon = styled.img`
  margin-left: 0.375rem;
  transition: 0.5s;

  &.toggle {
    transform: rotate(180deg);
  }
`

const PoolValue = styled.span`
  white-space: nowrap;
`;

const columns = columnsDef.map((column => ({
  id: column.id,
  name: column.normal,
  label: column.normal
})));

export default React.forwardRef((props: ITableProps, ref) => {
  const scrollBarEl = useRef<HTMLDivElement>(null);
  const tableWrapperEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollBarEl.current.onscroll = (): void => {
      if (tableWrapperEl.current && scrollBarEl.current)
        tableWrapperEl.current.scrollLeft = scrollBarEl.current.scrollLeft;
    };
  }, []);

  const renderCell = (cell, key): JSX.Element => {
    let content = cell.value;

    switch (columns[key].label) {
      case 'POOL':
        content =  (
          <>
            <BnbIcon src="/images/farms/hard-bnb.svg" alt="icon" />
            <PoolValue>
              {cell.value}
            </PoolValue>

          </>
        )
        break;
      case 'APY':
        content = (
          <>
            {`${cell.value}%`}
            <CalculateIcon src="/images/calculate.svg" alt="calculate" />
            <MultiplyBadge>
              20x
            </MultiplyBadge>
          </>
        )
        break;
      case 'EARNED':
        content = (
          <>
            <Earned>
              ?
            </Earned>
            <HarvestButton disabled>
              Harvest
            </HarvestButton>
          </>
        )
        break;
      case 'STAKED':
        content = (
          <>
            <ConnectWalletButton>
              Connect Wallet
            </ConnectWalletButton>
          </>
        )
        break;
      case 'DETAILS':
        content = (
          <DetailsContainer>
            <div>
              <StakeLabel>
                Stake:
              </StakeLabel>
              <StakeTitle>
                HARD-BNB LP
                <OpenIcon src="/images/open_in_new.svg" alt="open in new"/>
              </StakeTitle>
            </div>
            <div>
              <StakeLabel>
                Liquidity:
              </StakeLabel>
              <span>
                $5347709
              </span>
            </div>
          </DetailsContainer>
        )
        break;
      case 'LINKS':
        content = (
          <LinkContainer>
            <Link to='/farms'>
              View on BSCScan
            </Link>
            <Link to='/farms'>
              View on Info
            </Link>
          </LinkContainer>
        )
        break;
      default:
        content = cell.value;
    }

    return (
      <Cell key={`cell-${columns[key].label}`}>
        <CellInner>
          { content }
        </CellInner>
      </Cell>
    )
  }

  const renderSortArrow = (column: HeaderType<TableDataTypes>): JSX.Element => {
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

  const { headers, rows, toggleSort, setSearchString  } = useTable(columns, tempData, { sortable: true });

  React.useImperativeHandle(ref, () => ({
    setTableQuery(query: string) {
      setSearchString(query);
    }
  }));

  return (
    <Container>
      <ScrollBar ref={scrollBarEl} />
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
                    <span className="bold">{columnsDef[key].bold} </span>
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
            rows.map((row) => (
              <tr key={`row-${row.id}`}>
                {row.cells.map(renderCell)}
              </tr>
            ))
          }
          </TableBody>
        </StyledTable>
      </TableWrapper>
    </Container>
  );
});
