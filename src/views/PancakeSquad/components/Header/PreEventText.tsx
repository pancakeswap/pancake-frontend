import React from 'react'
import { darkColors, Text } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import { SaleStatusEnum, UserStatusEnum } from '../../types'

type PreEventProps = {
  t: ContextApi['t']
  saleStatus: SaleStatusEnum
  userStatus: UserStatusEnum
}

const preEventTextMapping = (t: ContextApi['t'], userStatus: UserStatusEnum) => {
  switch (userStatus) {
    case UserStatusEnum.UNCONNECTED:
      return t('Are you ready?')
    case UserStatusEnum.NO_PROFILE:
      return t('You need a profile to participate!')
    case UserStatusEnum.PROFILE_ACTIVE:
      return t('You’re all set!')
    case UserStatusEnum.PROFILE_ACTIVE_GEN0:
      return t('You’re all set!')
    default:
      return ''
  }
}

const PreEventText: React.FC<PreEventProps> = ({ t, saleStatus, userStatus }) =>
  [SaleStatusEnum.Pending, SaleStatusEnum.Premint].includes(saleStatus) ? (
    <Text fontSize="16px" color={darkColors.text}>
      {preEventTextMapping(t, userStatus)}
    </Text>
  ) : null

export default PreEventText
