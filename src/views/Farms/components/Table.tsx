import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

import ScrollBar from './ScrollBar'
import { columnsDef } from "./temp";
import Cell from "./Cell";

export interface ITableProps {
  data: string[]
}

export const Container = styled.div`
  padding: 24px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 0px 1px rgba(25, 19, 38, 0.15);
  border-radius: 32px;
  max-width: 500px;
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const StyledTable = styled.table`
  border-collapse: collapse;
  min-width: 800px;
  font-size: 0.9rem;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 0px 1px rgba(25, 19, 38, 0.15);
  border-radius: 4px;
  text-align: center;
`;

export const TableHead = styled.thead`
  & tr {
    background-color: #eff4f5;
    border-radius: 4px;
    color: #8f80ba;
    font-weight: 700;
    text-transform: capitalize;
    cursor: pointer;

    & th,
    td {
      padding: 12px 15px;
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

export const TableBody = styled.tbody`
  & tr {
    border-bottom: 1px solid #dddddd;

    & th,
    td {
      padding: 12px 15px;
    }
  }

  & tr:nth-of-type(2n) {
    background-color: ${(props) => props?.theme?.colors?.background};
  }

  & tr:hover {
    transition: 0.3s;
    color: #457b9d;
  }
`;

export default function Table (props: ITableProps) {
  const scrollBarEl = useRef<HTMLDivElement>(null);
  const tableEl = useRef<HTMLTableElement>(null);
  const tableWrapperEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollBarEl.current) {
      scrollBarEl.current.onscroll = (): void => {
        if (tableWrapperEl.current && scrollBarEl.current)
          tableWrapperEl.current.scrollLeft = scrollBarEl.current.scrollLeft;
      };
    }
  }, []);

  return (
    <Container>
      <ScrollBar ref={scrollBarEl} />
      <TableWrapper ref={tableWrapperEl}>
      <StyledTable ref={tableEl}>
          <TableHead>
            <tr>
              {columnsDef.map((column, key) => (
                <Cell key={`head-${column.id}`} keyId={`head-${key}`} isHeader>
                  <span className="bold">{column.bold} </span>
                  {column.normal}
                </Cell>
              ))}
            </tr>
          </TableHead>
        </StyledTable>
      </TableWrapper>
    </Container>
  );
}
