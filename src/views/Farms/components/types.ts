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
  width: number;
};

export type TableDataTypes = {
  POOL: string;
  APY: string;
  EARNED: string;
  STAKED: string;
  DETAILS: string;
  LINKS: string;
}

export const ColumnsDef: ColumnsDefTypes[] = [
  {
    id: 1,
    bold: "",
    normal: "POOL",
  },
  {
    id: 2,
    bold: "",
    normal: "APY",
  },
  {
    id: 3,
    bold: "CAKE",
    normal: "EARNED",
  },
  {
    id: 4,
    bold: "LP TOKENS",
    normal: "STAKED",
  },
  {
    id: 5,
    bold: "",
    normal: "DETAILS",
  },
  {
    id: 6,
    bold: "",
    normal: "LINKS",
  }
];