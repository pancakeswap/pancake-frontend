import { FarmProps } from './Farm/Cells/Farm'
import { AprProps } from '../../Farms/components/FarmTable/Apr'
import { EarnedProps } from './Farm/Cells/Earned'
import { StakedProps } from './Farm/Cells/Staked'
import { MultiplierProps } from './Farm/Cells/Multiplier'
import { LiquidityProps } from './Farm/Cells/Liquidity'
import { UnstakeProps } from './Farm/Cells/Unstake'

export interface RowProps {
  farm: FarmProps
  earned: EarnedProps
  staked: StakedProps
  multiplier: MultiplierProps
  liquidity: LiquidityProps
  unstake?: UnstakeProps
  apr?: AprProps
}

export type ColumnsDefTypes = {
  id: number
  label: string
  name: string
  sortable: boolean
}

export const V3Step1DesktopColumnSchema: ColumnsDefTypes[] = [
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
    name: 'liquidity',
    sortable: true,
    label: 'Liquidity',
  },
  {
    id: 5,
    name: 'multiplier',
    sortable: true,
    label: 'Multiplier',
  },
  {
    id: 6,
    name: 'unstake',
    sortable: true,
    label: '',
  },
]
