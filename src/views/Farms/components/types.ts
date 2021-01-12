export type TableProps = {
  data?: TableDataTypes[];
  selectedFilters?: string;
  sortBy?: string;
  sortDir?: string;
  onSort?: (value: string) => void;
};

export type ColumnsDefTypes = {
  id: number;
  bold: string;
  normal: string;
};

export type ScrollBarProps = {
  ref: string;
};

export type TableDataTypes = {
  poolImage: string,
}