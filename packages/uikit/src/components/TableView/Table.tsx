import { useCallback } from "react";
import styled from "styled-components";
import { ISortOrder, SORT_ORDER, SortArrowButton } from "./SortArrowButton";

export interface BasicDataType {
  [key: string]: any;
}

export interface IColumnsType<T extends BasicDataType> {
  title: React.ReactNode | (() => React.ReactNode);
  dataIndex: keyof T | null;
  key: React.Key;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sorter?: boolean;
  minWidth?: string;
  display?: boolean;
  clickable?: boolean;
}

export interface ITableViewProps<T extends BasicDataType> {
  getRowKey?: (item: T) => string;
  rowKey?: string;
  columns: IColumnsType<T>[];
  data: T[];
  onSort?: (parms: { dataIndex: IColumnsType<T>["dataIndex"]; order: ISortOrder }) => void;
  sortOrder?: ISortOrder;
  sortField?: IColumnsType<T>["dataIndex"];
  onRowClick?: (record: T, e: React.MouseEvent) => void;
}

const Table = styled.table`
  width: 100%;

  tr {
    th,
    td {
      padding: 12px;
      vertical-align: middle;
    }
    th:last-child,
    td:last-child {
      padding-right: 24px;
    }

    th:first-child,
    td:first-child {
      padding-left: 24px;
    }
  }
`;

const TableHeader = styled.thead`
  text-align: left;
  th {
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
    vertical-align: middle;
    color: ${({ theme }) => theme.colors.secondary};

    button {
      margin-left: 8px;
    }
  }
`;

const TableBody = styled.tbody``;

const Row = styled.tr<{ $withLink?: boolean }>`
  border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};
  ${({ $withLink, theme }) =>
    $withLink &&
    `
    cursor: pointer;
    &:hover {
      background: ${theme.colors.backgroundHover};
    }
    &:active {
      background: ${theme.colors.backgroundTapped};
    }
  `}

  &:last-child {
    border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  }
`;

const Cell = styled.td``;

interface ITableCellProps<T extends BasicDataType> {
  col: IColumnsType<T>;
  data: T;
  idx: number;
}

const TableCell = <T extends BasicDataType>({ col, data, idx }: ITableCellProps<T>) => {
  return (
    <Cell
      key={col.key}
      style={{
        display: col.display === false ? "none" : "table-cell",
      }}
      data-un-clickable={col.clickable === false ? true : undefined}
    >
      {col.render
        ? col.render(col.dataIndex ? data[col.dataIndex] : data, data, idx)
        : col.dataIndex
        ? data[col.dataIndex]
        : null}
    </Cell>
  );
};

export const TableView = <T extends BasicDataType>({
  columns,
  data,
  rowKey,
  getRowKey: getRowKey_,
  onSort,
  sortOrder,
  sortField,
  onRowClick,
}: ITableViewProps<T>) => {
  const getRowKey = useCallback(
    (rowData: T) =>
      getRowKey_
        ? getRowKey_(rowData)
        : rowKey
        ? rowData[rowKey]
        : rowData.key ?? Object.values(rowData).slice(0, 2).join("-"),
    [rowKey, getRowKey_]
  );

  const handleSort = useCallback(
    (order: ISortOrder, dataIndex: IColumnsType<T>["dataIndex"]) => {
      onSort?.({ order, dataIndex });
    },
    [onSort]
  );

  const handleClick = useCallback(
    (item: T, e: React.MouseEvent<HTMLTableRowElement>) => {
      if (e.target instanceof Element && e.target.closest(`[data-un-clickable]`)) {
        return;
      }
      onRowClick?.(item, e);
    },
    [onRowClick]
  );

  return (
    <Table>
      <TableHeader>
        <Row>
          {columns.map((col) => (
            <th
              key={col.key}
              style={{
                minWidth: col.minWidth ?? "auto",
                display: col.display === false ? "none" : "table-cell",
              }}
            >
              {typeof col.title === "function"
                ? col.title()
                : typeof col.title === "string"
                ? col.title.toUpperCase()
                : col.title}
              {col.sorter ? (
                <SortArrowButton
                  onlyDESC
                  width="14px"
                  onSort={(e) => handleSort(e, col.dataIndex)}
                  sortOrder={sortField === col.dataIndex ? sortOrder : SORT_ORDER.NULL}
                />
              ) : null}
            </th>
          ))}
        </Row>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <Row $withLink={!!onRowClick} key={getRowKey(item)} onClick={(e) => handleClick(item, e)}>
            {columns.map((col, idx) => (
              <TableCell col={col} data={item} idx={idx} key={col.key} />
            ))}
          </Row>
        ))}
      </TableBody>
    </Table>
  );
};
