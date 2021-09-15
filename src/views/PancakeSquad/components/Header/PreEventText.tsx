import React from 'react'
import { Text } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import { SaleStatusEnum, UserStatusEnum } from '../../types'

type PreEventProps = {
  t: ContextApi['t']
  saleStatus: SaleStatusEnum
  userStatus: UserStatusEnum
}

const PreEventTextMapping: Record<UserStatusEnum, string> = {
  [UserStatusEnum.UNCONNECTED]: 'Are you ready?',
  [UserStatusEnum.NO_PROFILE]: 'You need a profile to participate!',
  [UserStatusEnum.PROFILE_ACTIVE]: 'You’re all set!',
  [UserStatusEnum.PROFILE_ACTIVE_GEN0]: 'You’re all set!',
}

const PreEventText: React.FC<PreEventProps> = ({ t, saleStatus, userStatus }) =>
  saleStatus === SaleStatusEnum.Pending ? (
    <Text fontSize="16px" color="text">
      {t(PreEventTextMapping[userStatus])}
    </Text>
  ) : null

export default PreEventText
