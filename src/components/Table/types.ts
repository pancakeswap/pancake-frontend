
export type ColumnType<T extends DataType> = {
  id: number;
  name: string;
  label?: string;
  hidden?: boolean;
  sort?: ((a: RowType<T>, b: RowType<T>) => number) | undefined;
  render?: ({ value, row }: RenderFunctionArgsType<T>) => React.ReactNode;
  headerRender?: HeaderRenderType<string>;
};

export type ColumnStateType<T extends DataType> = {
  id: number;
  name: string;
  label: string;
  hidden: boolean;
  sort?: ((a: RowType<T>, b: RowType<T>) => number) | undefined;
  sorted: {
    on: boolean;
    asc?: boolean;
  };
  headerRender?: HeaderRenderType<string>;
};

export type HeaderRenderType<T> = ({ label }: { label: T }) => React.ReactNode;

// this is the type saved as state and returned
export type HeaderType<T extends DataType> = {
  id: number;
  name: string;
  label?: string;
  hidden?: boolean;
  sorted: {
    on: boolean;
    asc?: boolean;
  };
  sort?: ((a: RowType<T>, b: RowType<T>) => number) | undefined;
  render: () => React.ReactNode;
};

export type DataType = { [key: string]: string };

export type ColumnByNamesType<T extends DataType> = {
  [key: string]: ColumnType<T>;
};

export type RenderFunctionType<T> = ({ value, row }: RenderFunctionArgsType<T>) => React.ReactNode | undefined;

type RenderFunctionArgsType<T> = {
  value: React.ReactNode;
  row?: T;
};

export type ColumnByNameType<T extends DataType> = Omit<Required<ColumnType<T>>, "name" | "sort">;

export interface RowType<T extends DataType> {
  id: number;
  cells: CellType[];
  hidden?: boolean;
  selected?: boolean;
  original: T;
}

export type CellType = {
  value: string;
  render: () => React.ReactNode;
};

export interface UseTableTypeParams<T extends DataType> {
  columns: ColumnType<T>[];
  data: T[];
  options?: {
    sortable?: boolean;
    selectable?: boolean;
    filter?: (row: RowType<T>[]) => RowType<T>[];
    filterOn?: boolean;
  };
}

export interface UseTablePropsType<T extends DataType> {
  columns: ColumnType<T>[];
  data: T[];
  options?: {
    sortable?: boolean;
    selectable?: boolean;
    filter?: (row: RowType<T>[]) => RowType<T>[];
  };
}

export interface UseTableOptionsType<T extends DataType> {
  sortable?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  filter?: (row: RowType<T>[]) => RowType<T>[];
}

export interface UseTableReturnType<T extends DataType> {
  headers: HeaderType<T>[];
  originalRows: RowType<T>[];
  rows: RowType<T>[];
  selectedRows: RowType<T>[];
  dispatch: React.Dispatch<TableAction<T>>;
  setSearchString: (searchString: string) => void;
  toggleAllState: boolean;
  pagination: PaginatorType;
}

type PaginatorType = {
  nextPage: () => void;
  prevPage: () => void;
  page: number;
  perPage: number;
  canNext: boolean;
  canPrev: boolean;
};

export type TableState<T extends DataType> = {
  columnsByName: ColumnByNamesType<T>;
  columns: ColumnStateType<T>[];
  rows: RowType<T>[];
  originalRows: RowType<T>[];
  selectedRows: RowType<T>[];
  filterOn: boolean;
  sortColumn: string | null;
  toggleAllState: boolean;
  pagination: PaginatorType;
  paginationEnabled: boolean;
};

export type TableAction<T extends DataType> =
  | { type: "TOGGLE_SORT"; columnName: string; isAscOverride?: boolean }
  | { type: "SELECT_ROW"; rowId: number }
  | { type: "GLOBAL_FILTER"; filter: (row: RowType<T>[]) => RowType<T>[] }
  | { type: "SEARCH_STRING"; searchString: string }
  | { type: "GLOBAL_FILTER_OFF" }
  | { type: "SET_ROWS"; data: RowType<T>[] }
  | { type: "NEXT_PAGE" }
  | { type: "PREV_PAGE" }
  | { type: "TOGGLE_ALL" };
