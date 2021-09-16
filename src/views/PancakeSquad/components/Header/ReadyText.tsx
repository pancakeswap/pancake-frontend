import React from 'react'
import { CheckmarkIcon, Flex, Text } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import { SaleStatusEnum, UserStatusEnum } from '../../types'

type ReadyTextProps = {
  t: ContextApi['t']
  saleStatus: SaleStatusEnum
  userStatus: UserStatusEnum
  isApproved: boolean
}

const ReadyText: React.FC<ReadyTextProps> = ({ t, saleStatus, userStatus, isApproved }) => {
  const isGen0User = UserStatusEnum.PROFILE_ACTIVE_GEN0
  const isUserReady =
    (userStatus === UserStatusEnum.PROFILE_ACTIVE && saleStatus < SaleStatusEnum.Sale) ||
    (userStatus === isGen0User && saleStatus === SaleStatusEnum.Pending)
  return isUserReady && isApproved ? (
    <Flex alignItems="center" mt="30px">
      <CheckmarkIcon color="success" width="17px" mr="2px" />
      <Text fontSize="16px" color="success" bold>
        {t(isGen0User ? 'Ready for Pre-Sale!' : 'Ready for Public Sale!')}
      </Text>
    </Flex>
  ) : null
}

export default ReadyText
