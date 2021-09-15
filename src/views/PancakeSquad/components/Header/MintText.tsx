import React from 'react'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import { SaleStatusEnum, UserStatusEnum } from '../../types'

type PreEventProps = {
  t: ContextApi['t']
  saleStatus: SaleStatusEnum
  userStatus: UserStatusEnum
  numberTicketsOfUser: number
  numberTokensOfUser: number
}

const MintText: React.FC<PreEventProps> = ({ t, saleStatus, userStatus, numberTicketsOfUser, numberTokensOfUser }) => {
  const isUserUnconnected = userStatus === UserStatusEnum.UNCONNECTED
  const displayMintText =
    (userStatus === UserStatusEnum.PROFILE_ACTIVE_GEN0 && saleStatus === SaleStatusEnum.Presale) ||
    saleStatus >= SaleStatusEnum.Sale
  const hasNoTicketOrToken = numberTicketsOfUser === 0 && numberTokensOfUser === 0
  return displayMintText ? (
    <Flex flexDirection="column" mb="24px">
      <Box>
        <Text fontSize="16px" color="text" mr="2px">
          {t('Your Mint Tickets')}
        </Text>
        <Text fontSize="16px" color={numberTicketsOfUser > 0 ? 'warning' : 'failure'} bold>
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
