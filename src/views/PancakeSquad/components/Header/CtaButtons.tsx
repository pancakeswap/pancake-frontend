import React, { useEffect, useState } from 'react'
import { Button, Flex, Text, useModal } from '@pancakeswap/uikit'
import { BigNumber } from '@ethersproject/bignumber'
import { ContextApi } from 'contexts/Localization/types'
import { DefaultTheme } from 'styled-components'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useNftSaleContract } from 'hooks/useContract'
import { SaleStatusEnum, UserStatusEnum } from '../../types'
import ConfirmModal from '../Modals/Confirm'
import BuyTicketsModal from '../Modals/BuyTickets'

type PreEventProps = {
  t: ContextApi['t']
  saleStatus: SaleStatusEnum
  userStatus: UserStatusEnum
  theme: DefaultTheme
  canClaimForGen0: boolean
  maxPerAddress: number
  maxPerTransaction: number
  numberTicketsOfUser: number
  numberTicketsForGen0: number
  numberTicketsUsedForGen0: number
  maxSupply: number
  totalSupplyMinted: number
  numberTokensOfUser: number
  cakeBalance: BigNumber
  pricePerTicket: BigNumber
  ticketsOfUser: number[]
}

const CtaButtons: React.FC<PreEventProps> = ({
  t,
  saleStatus,
  userStatus,
  theme,
  canClaimForGen0,
  maxPerAddress,
  maxPerTransaction,
  numberTicketsOfUser,
  numberTicketsForGen0,
  numberTicketsUsedForGen0,
  numberTokensOfUser,
  maxSupply,
  totalSupplyMinted,
  cakeBalance,
  pricePerTicket,
  ticketsOfUser,
}) => {
  const [isTransactionLoading, setIsTransactionLoading] = useState(null)
  const [transactionIdResult, setTransactionIdResult] = useState(null)
  const { callWithGasPrice } = useCallWithGasPrice()
  const nftSaleContract = useNftSaleContract()

  const isUserUnconnected = userStatus === UserStatusEnum.UNCONNECTED
  const isUserUnactiveProfile = userStatus === UserStatusEnum.NO_PROFILE
  const canBuySaleTicket =
    saleStatus === SaleStatusEnum.Sale && numberTicketsOfUser - numberTicketsUsedForGen0 < maxPerAddress
  const canMintTickets = saleStatus === SaleStatusEnum.Claim && numberTicketsOfUser > 0
  const hasSquad = saleStatus === SaleStatusEnum.Claim && numberTokensOfUser > 0
  const canViewMarket = maxSupply === totalSupplyMinted

  const buyTicketCallBack = ({ isLoading, transactionId }: { isLoading?: boolean; transactionId?: string }) => {
    if (isLoading !== undefined) setIsTransactionLoading(isLoading)
    if (transactionId !== undefined) setTransactionIdResult(transactionId)
  }
  const mintTokenCallBack = async () => {
    setIsTransactionLoading(true)
    const receipt = await callWithGasPrice(nftSaleContract, 'mint', ticketsOfUser)
    // set transactionId
  }

  const [onPresentConfirmModal] = useModal(
    <ConfirmModal
      title={t('Confirm')}
      isLoading={isTransactionLoading}
      headerBackground={theme.colors.gradients.cardHeader}
      transactionId={transactionIdResult}
    />,
  )

  const [onPresentBuyTicketsModal] = useModal(
    <BuyTicketsModal
      title={t('Buy Minting Tickets')}
      buyTicketCallBack={buyTicketCallBack}
      headerBackground={theme.colors.gradients.cardHeader}
      cakeBalance={cakeBalance}
      maxPerAddress={maxPerAddress}
      maxPerTransaction={maxPerTransaction}
      numberTicketsForGen0={numberTicketsForGen0}
      numberTicketsOfUser={numberTicketsOfUser}
      numberTicketsUsedForGen0={numberTicketsUsedForGen0}
      pricePerTicket={pricePerTicket}
      saleStatus={saleStatus}
    />,
  )

  useEffect(
    () => isTransactionLoading !== null && onPresentConfirmModal(),
    [isTransactionLoading, onPresentConfirmModal],
  )

  useEffect(() => transactionIdResult !== null && setIsTransactionLoading(false), [transactionIdResult])

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
        <Button scale="sm" onClick={mintTokenCallBack}>
          {t('Mint NFTs (%tickets_number%)')}
        </Button>
      )}
      {canViewMarket && <Button scale="sm">{t('View market')}</Button>}
      {hasSquad && <Button scale="sm">{t('Your Squad (%tokens_number%)')}</Button>}
    </Flex>
  )
}

export default CtaButtons
