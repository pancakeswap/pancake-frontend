import { useMemo, useReducer, useEffect, ReactNode } from "react";
import {
  ColumnByNamesType,
  ColumnType,
  TableState,
  TableAction,
  DataType,
  UseTableReturnType,
  UseTableOptionsType,
  RowType,
  HeaderType,
  ColumnStateType,
  HeaderRenderType,
} from "./types";
import { byTextAscending, byTextDescending } from "./utils";

const sortByColumn = <T extends DataType>(
  data: RowType<T>[],
  sortColumn: string,
  columns: ColumnStateType<T>[]
): RowType<T>[] => {
  let isAscending = null;
  let sortedRows: RowType<T>[] = [...data];

  columns.forEach((column) => {
    // if the row was found
    if (sortColumn === column.name) {
      isAscending = column.sorted.asc;

      if (column.sort) {
        sortedRows = isAscending ? data.sort(column.sort) : data.sort(column.sort).reverse();
        // default to sort by string
      } else {
        sortedRows = isAscending
          ? data.sort(byTextAscending((object) => object.original[sortColumn]))
          : data.sort(byTextDescending((object) => object.original[sortColumn]));
      }
    }
  });

  return sortedRows;
};

const getPaginatedData = <T extends DataType>(rows: RowType<T>[], perPage: number, page: number) => {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return rows.slice(start, end);
};

const getColumnsByName = <T extends DataType>(columns: ColumnType<T>[]): ColumnByNamesType<T> => {
  const columnsByName: ColumnByNamesType<T> = {};
  columns.forEach((column) => {
    const col: ColumnType<T> = {
      id: column.id,
      name: column.name,
      label: column.label,
    };

    if (column.render) {
      col.render = column.render;
    }
    col.hidden = column.hidden;
    columnsByName[column.name] = col;
  });

  return columnsByName;
};

const sortDataInOrder = <T extends DataType>(data: T[], columns: ColumnType<T>[]): T[] => {
  return data.map((row: T) => {
    const newRow: DataType = {};
    columns.forEach((column) => {
      if (!(column.name in row)) {
        throw new Error(`Invalid row data, ${column.name} not found`);
      }
      newRow[column.name] = row[column.name];
    });
    return newRow as T;
  });
};

const makeRender = <T extends DataType, K>(
  valueT: K,
  render: (({ value, row }: { value: K; row: T }) => ReactNode) | undefined,
  row: T
) => {
  return render ? () => render({ row, value: valueT }) : () => valueT;
};

const makeHeaderRender = (label: string, render?: HeaderRenderType<string>) => {
  return render ? () => render({ label }) : () => label;
};
export const createReducer = <T extends DataType>() => (
  state: TableState<T>,
  action: TableAction<T>
): TableState<T> => {
  switch (action.type) {
    case "SET_ROWS": {
      let rows = [...action.data];
      // preserve sorting if a sort is already enabled when data changes
      if (state.sortColumn) {
        rows = sortByColumn(action.data, state.sortColumn, state.columns);
      }

      if (state.paginationEnabled === true) {
        rows = getPaginatedData(rows, state.pagination.perPage, state.pagination.page);
      }

      if (state.paginationEnabled === true) {
        rows = getPaginatedData(rows, state.pagination.perPage, state.pagination.page);
      }

      return {
        ...state,
        rows,
        originalRows: action.data,
      };
    }

    case "GLOBAL_FILTER": {
      const filteredRows = action.filter(state.originalRows);
      const selectedRowsById: { [key: number]: boolean } = {};
      state.selectedRows.forEach((row) => {
        selectedRowsById[row.id] = !!row.selected;
      });

      return {
        ...state,
        rows: filteredRows.map((row) => {
          return selectedRowsById[row.id] ? { ...row, selected: selectedRowsById[row.id] } : { ...row };
        }),
        filterOn: true,
      };
    }
    case "SEARCH_STRING": {
      const stateCopySearch = { ...state };
      stateCopySearch.rows = stateCopySearch.originalRows.filter((row) => {
        return (
          row.cells.filter((cell) => {
            if (cell.value.includes(action.searchString)) {
              return true;
            }
            return false;
          }).length > 0
        );
      });
      return stateCopySearch;
    }
    default:
      throw new Error("Invalid reducer action");
  }
};

export const useTable = <T extends DataType>(
  columns: ColumnType<T>[],
  data: T[],
  options?: UseTableOptionsType<T>
): UseTableReturnType<T> => {
  const columnsWithSorting: ColumnStateType<T>[] = useMemo(
    () =>
      columns.map((column) => {
        return {
          ...column,
          label: column.label ? column.label : column.name,
          hidden: column.hidden ? column.hidden : false,
          sort: column.sort,
          sorted: {
            on: false,
          },
        };
      }),
    [columns]
  );
  const columnsByName = useMemo(() => getColumnsByName(columnsWithSorting), [columnsWithSorting]);

  const tableData: RowType<T>[] = useMemo(() => {
    const sortedData = sortDataInOrder(data, columnsWithSorting);

    const newData = sortedData.map((row, idx) => {
      return {
        id: idx,
        selected: false,
        hidden: false,
        original: row,
        cells: Object.entries(row)
          .map(([column, value]) => {
            return {
              hidden: columnsByName[column].hidden,
              field: column,
              value,
              render: makeRender(value, columnsByName[column].render, row),
            };
          })
          .filter((cell) => !cell.hidden),
      };
    });
    return newData;
  }, [data, columnsWithSorting, columnsByName]);

  const reducer = createReducer<T>();

  const [state, dispatch] = useReducer(reducer, {
    columns: columnsWithSorting,
    columnsByName,
    originalRows: tableData,
    rows: tableData,
    selectedRows: [],
    toggleAllState: false,
    filterOn: !!options?.filter,
    sortColumn: null,
    paginationEnabled: !!options?.pagination,
    pagination: {
      page: 1,
      perPage: 10,
      canNext: true,
      canPrev: false,
      nextPage: () => {
        // nextPage feature
      },
      prevPage: () => {
        // prevPage feature
      },
    },
  });

  useEffect(() => {
    dispatch({ type: "SET_ROWS", data: tableData });
  }, [tableData]);

  const headers: HeaderType<T>[] = useMemo(() => {
    return [
      ...state.columns.map((column) => {
        const label = column.label ? column.label : column.name;
        return {
          ...column,
          render: makeHeaderRender(label, column.headerRender),
        };
      }),
    ];
  }, [state.columns]);

  useEffect(() => {
    if (options?.filter) {
      dispatch({ type: "GLOBAL_FILTER", filter: options.filter });
    }
  }, [options?.filter]);

  return {
    headers: headers.filter((column) => !column.hidden),
    rows: state.rows,
    originalRows: state.originalRows,
    selectedRows: state.selectedRows,
    dispatch,
    setSearchString: (searchString: string) => dispatch({ type: "SEARCH_STRING", searchString }),
    pagination: state.pagination,
    toggleAllState: state.toggleAllState,
  };
};
