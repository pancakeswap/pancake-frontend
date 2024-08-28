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
}

export interface ITableViewProps<T extends BasicDataType> {
  rowKey?: string;
  columns: IColumnsType<T>[];
  data: T[];
  onSort?: (parms: { dataIndex: IColumnsType<T>["dataIndex"]; order: ISortOrder }) => void;
  sortOrder?: ISortOrder;
  sortField?: IColumnsType<T>["dataIndex"];
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

const Row = styled.tr`
  border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};

  &:last-child {
    border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  }
`;

const Cell = styled.td``;

export const TableView = <T extends BasicDataType>({
  columns,
  data,
  rowKey,
  onSort,
  sortOrder,
  sortField,
}: ITableViewProps<T>) => {
  const getRowKey = useCallback(
    (rowData: T) => (rowKey ? rowData[rowKey] : rowData.key ?? Object.values(rowData).slice(0, 2).join("-")),
    [rowKey]
  );

  const handleSort = useCallback(
    (order: ISortOrder, dataIndex: IColumnsType<T>["dataIndex"]) => {
      onSort?.({ order, dataIndex });
    },
    [onSort]
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
          <Row key={getRowKey(item)}>
            {columns.map((col, idx) => (
              <Cell
                key={col.key}
                style={{
                  display: col.display === false ? "none" : "table-cell",
                }}
              >
                {col.render
                  ? col.render(col.dataIndex ? item[col.dataIndex] : item, item, idx)
                  : col.dataIndex
                  ? item[col.dataIndex]
                  : null}
              </Cell>
            ))}
          </Row>
        ))}
      </TableBody>
    </Table>
  );
};
