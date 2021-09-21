import { DynamicSaleInfos, FixedSaleInfos, UserStatusEnum } from 'views/PancakeSquad/types'

export type PancakeSquadHeaderType = {
  account: string
  isLoading: boolean
  fixedSaleInfo?: FixedSaleInfos
  dynamicSaleInfo?: DynamicSaleInfos
  userStatus: UserStatusEnum
}
