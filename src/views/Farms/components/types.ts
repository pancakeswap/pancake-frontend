export type TableProps = {
  data?: TableDataTypes[]
  selectedFilters?: string
  sortBy?: string
  sortDir?: string
  onSort?: (value: string) => void
}

export type ColumnsDefTypes = {
  id: number
  bold: string
  normal: string
  name: string
  translationId: number
}

export type ScrollBarProps = {
  ref: string
  width: number
}

export type TableDataTypes = {
  POOL: string
  APY: string
  EARNED: string
  STAKED: string
  DETAILS: string
  LINKS: string
}

export const ColumnsDef: ColumnsDefTypes[] = [
  {
    id: 1,
    bold: '',
    normal: 'POOL',
    name: 'pool',
    translationId: 999,
  },
  {
    id: 2,
    bold: '',
    normal: 'APY',
    name: 'apy',
    translationId: 999,
  },
  {
    id: 3,
    bold: 'CAKE',
    normal: 'EARNED',
    name: 'earned',
    translationId: 999,
  },
  {
    id: 4,
    bold: 'LP TOKENS',
    normal: 'STAKED',
    name: 'staked',
    translationId: 999,
  },
  {
    id: 5,
    bold: '',
    normal: 'DETAILS',
    name: 'details',
    translationId: 999,
  },
  {
    id: 6,
    bold: '',
    normal: 'LINKS',
    name: 'links',
    translationId: 999,
  },
  {
    id: 7,
    bold: '',
    normal: 'TAGS',
    name: 'tags',
    translationId: 999,
  },
]
