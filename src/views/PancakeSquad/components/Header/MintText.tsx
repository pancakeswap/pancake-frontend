import React from 'react'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import { BigNumber } from '@ethersproject/bignumber'
import { SaleStatusEnum, UserStatusEnum } from '../../types'

type PreEventProps = {
  t: ContextApi['t']
  saleStatus: SaleStatusEnum
  userStatus: UserStatusEnum
  numberTicketsOfUser: BigNumber
  numberTokensOfUser: BigNumber
}

const MintText: React.FC<PreEventProps> = ({ t, saleStatus, userStatus, numberTicketsOfUser, numberTokensOfUser }) => {
  const zero = BigNumber.from(0)
  const isUserUnconnected = userStatus === UserStatusEnum.UNCONNECTED
  const displayMintText =
    (userStatus === UserStatusEnum.PROFILE_ACTIVE_GEN0 && saleStatus === SaleStatusEnum.Presale) ||
    saleStatus >= SaleStatusEnum.Sale
  const hasNoTicketOrToken = numberTicketsOfUser.isZero() && numberTokensOfUser.isZero
  return displayMintText ? (
    <Flex flexDirection="column" mb="24px">
      <Box>
        <Text fontSize="16px" color="text" mr="2px">
          {t('Your Mint Tickets')}
        </Text>
        <Text fontSize="16px" color={numberTicketsOfUser.gt(zero) ? 'warning' : 'failure'} bold>
          {numberTicketsOfUser}
        </Text>
      </Box>
      {saleStatus === SaleStatusEnum.Claim && (isUserUnconnected || hasNoTicketOrToken) && (
        <Text mt="24px" fontSize="16px" color="warning" bold>
          {t(
            isUserUnconnected
              ? 'Redeem Mint Tickets to mint NFTs'
              : 'Sorry, you can’t mint any NFTs! Better luck next time.',
          )}
        </Text>
      )}
    </Flex>
  ) : null
}

export default MintText
