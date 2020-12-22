import * as React from "react";
import styled from 'styled-components';
import { useTable } from 'react-table';

const Styles = styled.div`
  padding: 1.5rem;
  background: #FFFFFF;
  /* Card/Light Drop Shadow */

  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.5), 0px 1px 1px rgba(25, 19, 38, 0.05);
  border-radius: 32px;

  table {
    border-spacing: 0;

    thead {
      background: #EFF4F5;
      border-radius: 4px;
      height: 24px;
    }

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;

      :last-child {
        border-right: 0;
      }
    }
  }
`

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns, data
  })
  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
export default function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
      },
      {
        Header: 'Info',
      },
    ],
    []
  )

  const data = [];
  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  );
}
