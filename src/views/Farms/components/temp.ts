import { ColumnsDefTypes, TableDataTypes } from "./types";

const columnsDef: ColumnsDefTypes[] = [
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
  },
  {
    id: 7,
    bold: "",
    normal: "TAGS",
  },
];

const tempData: TableDataTypes[] = [{
  poolImage: 'base64string'
}]

export { columnsDef, tempData };