import { DynamicSaleInfos, FixedSaleInfos } from 'views/PancakeSquad/types'

export type PancakeSquadHeaderType = {
  account: string
  isLoading: boolean
  fixedSaleInfo: FixedSaleInfos
  dynamicSaleInfo: DynamicSaleInfos
}
