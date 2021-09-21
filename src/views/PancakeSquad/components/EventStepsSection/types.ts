import { BigNumber } from '@ethersproject/bignumber'
import { ContextApi } from 'contexts/Localization/types'
import { DefaultTheme } from 'styled-components'
import { DynamicSaleInfos, FixedSaleInfos, UserStatusEnum } from 'views/PancakeSquad/types'

export type EventStepsProps = {
  fixedSaleInfo?: FixedSaleInfos
  dynamicSaleInfo?: DynamicSaleInfos
  isLoading: boolean
  userStatus: UserStatusEnum
  account: string
}

export type EventStepsType = { t: ContextApi['t']; theme: DefaultTheme; cakeBalance: BigNumber } & Pick<
  EventStepsProps,
  'dynamicSaleInfo' | 'fixedSaleInfo' | 'userStatus' | 'account'
>
