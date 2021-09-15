import React from 'react'
import { Button, Flex, Text, useModal } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import { DefaultTheme } from 'styled-components'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { SaleStatusEnum, UserStatusEnum } from '../../types'
import ConfirmModal from '../Modals/Confirm'
import EnableModal from '../Modals/Enable'
import BuyTicketsModal from '../Modals/BuyTickets'

type PreEventProps = {
  t: ContextApi['t']
  saleStatus: SaleStatusEnum
  userStatus: UserStatusEnum
  theme: DefaultTheme
  canClaimForGen0: boolean
  maxPerAddress: number
  numberTicketsOfUser: number
  numberTicketsUsedForGen0: number
  maxSupply: number
  totalSupplyMinted: number
  numberTokensOfUser: number
}

const CtaButtons: React.FC<PreEventProps> = ({
  t,
  saleStatus,
  userStatus,
  theme,
  canClaimForGen0,
  maxPerAddress,
  numberTicketsOfUser,
  numberTicketsUsedForGen0,
  numberTokensOfUser,
  maxSupply,
  totalSupplyMinted,
}) => {
  const [onPresentConfirmModal] = useModal(
    <ConfirmModal title={t('Confirm')} headerBackground={theme.colors.gradients.cardHeader} />,
  )
  const [onPresentEnableModal] = useModal(
    <EnableModal title={t('Enable')} headerBackground={theme.colors.gradients.cardHeader} />,
  )
  const [onPresentBuyTicketsModal] = useModal(
    <BuyTicketsModal
      title={t('Buy Minting Tickets')}
      onSuccess={onPresentConfirmModal}
      headerBackground={theme.colors.gradients.cardHeader}
    />,
  )

  const isUserUnconnected = userStatus === UserStatusEnum.UNCONNECTED
  const isUserUnactiveProfile = userStatus === UserStatusEnum.NO_PROFILE
  const canBuySaleTicket =
    saleStatus === SaleStatusEnum.Sale && numberTicketsOfUser - numberTicketsUsedForGen0 < maxPerAddress
  const canMintTickets = saleStatus === SaleStatusEnum.Claim && numberTicketsOfUser > 0
  const hasSquad = saleStatus === SaleStatusEnum.Claim && numberTokensOfUser > 0
  const canViewMarket = maxSupply === totalSupplyMinted

  return (
    <Flex>
      {isUserUnconnected && <ConnectWalletButton scale="sm" />}
      {isUserUnactiveProfile && <Button scale="sm">{t('Activate Profile')}</Button>}
      {(canClaimForGen0 || canBuySaleTicket) && (
        <Button scale="sm" onClick={onPresentBuyTicketsModal}>
          {t('Buy Tickets')}
        </Button>
      )}
      {canMintTickets && (
        <Button scale="sm" onClick={onPresentEnableModal}>
          {t('Mint NFTs (%tickets_number%)')}
        </Button>
      )}
      {canViewMarket && <Button scale="sm">{t('View market')}</Button>}
      {hasSquad && <Button scale="sm">{t('Your Squad (%tokens_number%)')}</Button>}
    </Flex>
  )
}

export default CtaButtons
