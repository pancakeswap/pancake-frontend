import styled from "styled-components";

export interface BasicDataType {
  [key: string]: any;
}

export interface IColumnsType<T extends BasicDataType> {
  title: React.ReactNode | (() => React.ReactNode);
  dataIndex: keyof T | null;
  key: React.Key;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

export interface ITableViewProps<T extends BasicDataType> {
  columns: IColumnsType<T>[];
  data: T[];
}

const Table = styled.table`
  width: 100%;

  th,
  td {
    padding: 12px 24px;
  }
`;

const TableHeader = styled.thead`
  text-align: left;
  th {
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
    color: ${({ theme }) => theme.colors.secondary};
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

export const TableView = <T extends BasicDataType>({ columns, data }: ITableViewProps<T>) => {
  return (
    <Table>
      <TableHeader>
        <Row>
          {columns.map((col) => (
            <th key={col.key}>
              {typeof col.title === "function"
                ? col.title()
                : typeof col.title === "string"
                ? col.title.toUpperCase()
                : col.title}
            </th>
          ))}
        </Row>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <Row key={item.key ?? Object.values(item).slice(0, 2).join("-")}>
            {columns.map((col, idx) => (
              <Cell key={col.key}>
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
