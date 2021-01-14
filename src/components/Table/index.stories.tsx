import React, { useMemo } from "react";
import { useTable, ColumnType } from "./index";
import { data, columns } from "./example/const";
import StyledTh from "./example/header";
import { DataType } from "./types";

const Table = <T extends DataType>({ _columns, _data }: { _columns: ColumnType<T>[]; _data: T[] }) => {
  const { headers, rows } = useTable(_columns, _data, {
    sortable: true,
  });

  return (
    <table>
      <thead>
        <tr>
          {headers.map((header) => (
            <StyledTh key={`header-${header.id}`} data-testid={`column-${header.name}`}>
              {header.label}

              {header.sorted && header.sorted.on ? <span data-testid={`sorted-${header.name}`} /> : null}
            </StyledTh>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr data-testid={`row-${row.id}`} key={row.id}>
            {row.cells.map((cell) => (
              <td>{cell.render()}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const TableComponent: React.FunctionComponent = () => {
  const memoColumns = useMemo(() => columns, []);
  const memoData = useMemo(() => data, []);

  return <Table _columns={memoColumns} _data={memoData} />;
};

export default {
  title: "Components/Table",
  component: TableComponent,
  argTypes: {},
};

export const Default: React.FC = () => {
  return (
    <div style={{ width: "500px" }}>
      <TableComponent />
    </div>
  );
};
