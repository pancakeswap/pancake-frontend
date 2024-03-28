import { ContextApi } from '@pancakeswap/localization'
import { DefaultTheme } from 'styled-components'
import { Address } from 'viem'
import { EventInfos, UserInfos, UserStatusEnum } from 'views/PancakeSquad/types'

export type EventStepsProps = {
  eventInfos?: EventInfos
  userInfos?: UserInfos
  isLoading: boolean
  userStatus: UserStatusEnum
  account?: Address
}

export type EventStepsType = { t: ContextApi['t']; theme: DefaultTheme; cakeBalance: bigint } & Pick<
  EventStepsProps,
  'eventInfos' | 'userInfos' | 'userStatus' | 'account'
>
