export enum TagType {
  // Category
  MISCELLANEOUS = 'Miscellaneous',
  ORACLE = 'Oracle',
  ORDER_TYPES = 'Order Types',

  // Pool
  CL_POOL = 'CLPool',
  BIN_POOL = 'BinPool',

  // Benefit
  LPs = 'LPs',
  TRADERS = 'Traders',
}

export enum TagValue {
  MORE = -1,
  FEATURED = 0,
  ALL = 1,
  MISCELLANEOUS = 2,
  ORACLE = 3,
  ORDER_TYPES = 4,
  CL_POOL = 5,
  BIN_POOL = 6,
  LPs = 7,
  TRADERS = 8,
}

export interface HooksType {
  title: JSX.Element
  desc: JSX.Element
  createDate: string
  githubLink: string
  tags: TagType[]
  tagsValue: TagValue[]
}
