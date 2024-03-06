export enum TagType {
  // Category
  MISCELLANEOUS = 'Miscellaneous',
  ORACLE = 'Oracle',
  ORDER_TYPES = 'Order Types',

  // Pool
  CLAMM = 'CLAMM',
  LBAMM = 'LBAMM',

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
  CLAMM = 5,
  LBAMM = 6,
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
