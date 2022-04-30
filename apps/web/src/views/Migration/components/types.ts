export type TableProps = {
  data?: TableDataTypes[]
  selectedFilters?: string
  sortBy?: string
  sortDir?: string
  onSort?: (value: string) => void
}

export type ColumnsDefTypes = {
  id: number
  label: string
  name: string
  sortable: boolean
}

export type TableDataTypes = {
  POOL: string
  APR: string
  EARNED: string
  STAKED: string
  DETAILS: string
  LINKS: string
}

export const DesktopColumnSchema: ColumnsDefTypes[] = [
  {
    id: 1,
    name: 'farm',
    sortable: true,
    label: '',
  },
  {
    id: 2,
    name: 'staked',
    sortable: true,
    label: 'Staked',
  },
  {
    id: 3,
    name: 'earned',
    sortable: true,
    label: 'Earned',
  },
  {
    id: 4,
    name: 'multiplier',
    sortable: true,
    label: 'Multiplier',
  },
  {
    id: 5,
    name: 'liquidity',
    sortable: true,
    label: 'Liquidity',
  },
  {
    id: 6,
    name: 'unstake',
    sortable: true,
    label: '',
  },
]

export const DesktopV2ColumnSchema: ColumnsDefTypes[] = [
  {
    id: 1,
    name: 'farm',
    sortable: true,
    label: '',
  },
  {
    id: 2,
    name: 'staked',
    sortable: true,
    label: 'Staked',
  },
  {
    id: 3,
    name: 'apr',
    sortable: true,
    label: 'Apr',
  },
  {
    id: 4,
    name: 'earned',
    sortable: true,
    label: 'Earned',
  },
  {
    id: 5,
    name: 'multiplier',
    sortable: true,
    label: 'Multiplier',
  },
  {
    id: 6,
    name: 'liquidity',
    sortable: true,
    label: '',
  },
]
