import BigNumber from 'bignumber.js'
import { DeserializedFarm } from '@pancakeswap/farms'

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

export type ScrollBarProps = {
  ref: string
  width: number
}

export type TableDataTypes = {
  POOL: string
  APR: string
  EARNED: string
  STAKED: string
  DETAILS: string
  LINKS: string
}

export const MobileColumnSchema: ColumnsDefTypes[] = [
  {
    id: 1,
    name: 'farm',
    sortable: true,
    label: '',
  },
  {
    id: 2,
    name: 'earned',
    sortable: true,
    label: 'Earned',
  },
  {
    id: 3,
    name: 'apr',
    sortable: true,
    label: 'APR',
  },
  {
    id: 6,
    name: 'details',
    sortable: true,
    label: '',
  },
]

export const DesktopColumnSchema: ColumnsDefTypes[] = [
  {
    id: 1,
    name: 'farm',
    sortable: true,
    label: '',
  },
  {
    id: 2,
    name: 'type',
    sortable: false,
    label: '',
  },
  {
    id: 3,
    name: 'earned',
    sortable: true,
    label: 'Earned',
  },
  {
    id: 4,
    name: 'apr',
    sortable: true,
    label: 'APR',
  },
  {
    id: 5,
    name: 'liquidity',
    sortable: true,
    label: 'Liquidity',
  },
  {
    id: 6,
    name: 'multiplier',
    sortable: true,
    label: 'Multiplier',
  },
  {
    id: 7,
    name: 'details',
    sortable: true,
    label: '',
  },
]

export interface FarmWithStakedValue extends DeserializedFarm {
  apr?: number
  lpRewardsApr?: number
  liquidity?: BigNumber
}
