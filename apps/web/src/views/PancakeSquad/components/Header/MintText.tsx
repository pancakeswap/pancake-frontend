import { ContextApi } from '@pancakeswap/localization'
import { Flex, lightColors, Text } from '@pancakeswap/uikit'

import { SaleStatusEnum, UserStatusEnum } from '../../types'

type PreEventProps = {
  t: ContextApi['t']
  saleStatus?: SaleStatusEnum
  userStatus: UserStatusEnum
  numberTicketsOfUser?: number
  numberTokensOfUser?: number
}

const MintText: React.FC<React.PropsWithChildren<PreEventProps>> = ({
  t,
  saleStatus,
  userStatus,
  numberTicketsOfUser = 0,
  numberTokensOfUser = 0,
}) => {
  const isUserUnconnected = userStatus === UserStatusEnum.UNCONNECTED
  const displayMintText =
    ((userStatus === UserStatusEnum.PROFILE_ACTIVE_GEN0 || numberTicketsOfUser > 0) &&
      saleStatus === SaleStatusEnum.Presale) ||
    (saleStatus && saleStatus >= SaleStatusEnum.Sale)
  const hasNoTicketOrToken = numberTicketsOfUser === 0 && numberTokensOfUser === 0
  return displayMintText ? (
    <Flex flexDirection="column" mb="24px">
      <Flex>
        <Text fontSize="16px" color={lightColors.invertedContrast} mr="2px">
          {t('Your Claim Tickets: ')}
        </Text>
        <Text fontSize="16px" color={numberTicketsOfUser > 0 ? lightColors.warning : lightColors.failure} bold>
          {numberTicketsOfUser}
        </Text>
      </Flex>
      {saleStatus === SaleStatusEnum.Claim && (isUserUnconnected || hasNoTicketOrToken) && (
        <Text mt="24px" fontSize="16px" color={lightColors.warning} bold>
          {isUserUnconnected
            ? t('Redeem Tickets to claim NFTs')
            : t('Sorry, you can’t claim any NFTs! Better luck next time.')}
        </Text>
      )}
    </Flex>
  ) : null
}

export default MintText
