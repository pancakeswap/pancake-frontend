import { EventInfos, UserInfos, UserStatusEnum } from 'views/PancakeSquad/types'
import { Address } from 'wagmi'

export type PancakeSquadHeaderType = {
  account: Address
  isLoading: boolean
  eventInfos?: EventInfos
  userInfos?: UserInfos
  userStatus: UserStatusEnum
}

export enum ButtonsEnum {
  ACTIVATE,
  BUY,
  MINT,
  END,
  NONE,
}
