/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import { Button, useModal } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import { ethers, BigNumber } from 'ethers'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useCake, useNftSaleContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { DefaultTheme } from 'styled-components'
import { ethersToBigNumber } from 'utils/bigNumber'
import { PancakeSquadContext } from 'views/PancakeSquad/context'
import { SaleStatusEnum, UserStatusEnum } from '../../types'
import BuyTicketsModal from '../Modals/BuyTickets'
import ConfirmModal from '../Modals/Confirm'
import ReadyText from '../Header/ReadyText'
import { getBuyButton, getBuyButtonText } from './utils'
import { BuyButtonsEnum } from './types'

type BuyTicketsProps = {
  t: ContextApi['t']
  account: string
  saleStatus: SaleStatusEnum
  userStatus: UserStatusEnum
  theme: DefaultTheme
  canClaimForGen0: boolean
  maxPerAddress: number
  maxPerTransaction: number
  numberTicketsOfUser: number
  numberTicketsForGen0: number
  numberTicketsUsedForGen0: number
  cakeBalance: BigNumber
  pricePerTicket: BigNumber
  startTimestamp: number
}

const BuyTicketsButtons: React.FC<BuyTicketsProps> = ({
  t,
  account,
  saleStatus,
  userStatus,
  theme,
  canClaimForGen0,
  maxPerAddress,
  maxPerTransaction,
  numberTicketsOfUser,
  numberTicketsForGen0,
  numberTicketsUsedForGen0,
  cakeBalance,
  pricePerTicket,
  startTimestamp,
}) => {
  const [txHashEnablingResult, setTxHashEnablingResult] = useState(null)
  const [txHashBuyingResult, setTxHashBuyingResult] = useState(null)
  const { callWithGasPrice } = useCallWithGasPrice()
  const nftSaleContract = useNftSaleContract()
  const { toastSuccess } = useToast()
  const cakeContract = useCake()
  const { isUserEnabled, setIsUserEnabled } = useContext(PancakeSquadContext)

  const canBuySaleTicket =
    saleStatus === SaleStatusEnum.Sale && numberTicketsOfUser - numberTicketsUsedForGen0 < maxPerAddress
  const isPreSale = saleStatus === SaleStatusEnum.Presale
  const isGen0User = userStatus === UserStatusEnum.PROFILE_ACTIVE_GEN0
  const isUserReady =
    (userStatus === UserStatusEnum.PROFILE_ACTIVE && saleStatus < SaleStatusEnum.Sale) ||
    (isGen0User && saleStatus === SaleStatusEnum.Pending)

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm, hasApproveFailed, hasConfirmFailed } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        try {
          const response = await cakeContract.allowance(account, nftSaleContract.address)
          const currentAllowance = ethersToBigNumber(response)
          return currentAllowance.gt(0)
        } catch (error) {
          return false
        }
      },
      onApprove: () => {
        return callWithGasPrice(cakeContract, 'approve', [nftSaleContract.address, ethers.constants.MaxUint256])
      },
      onApproveSuccess: async ({ receipt }) => {
        toastSuccess(t('Transaction has succeeded!'))
        setTxHashEnablingResult(receipt.transactionHash)
      },
      onConfirm: ({ ticketsNumber }) => {
        onPresentConfirmModal()
        return callWithGasPrice(nftSaleContract, isPreSale ? 'buyTicketsInPreSaleForGen0' : 'buyTickets', [
          ticketsNumber,
        ])
      },
      onSuccess: async ({ receipt }) => {
        toastSuccess(t('Transaction has succeeded!'))
        setTxHashBuyingResult(receipt.transactionHash)
      },
    })

  const onConfirmClose = () => {
    setTxHashBuyingResult(null)
  }

  const [onPresentConfirmModal] = useModal(
    <ConfirmModal
      title={t('Confirm')}
      isLoading={isConfirming}
      headerBackground={theme.colors.gradients.cardHeader}
      txHash={txHashBuyingResult}
      loadingText={t('Please confirm your transaction in wallet.')}
      loadingButtonLabel={t('Confirming...')}
      successButtonLabel={t('Close')}
      onConfirmClose={onConfirmClose}
    />,
    false,
  )

  const [onPresentEnableModal, onDismissEnableModal] = useModal(
    <ConfirmModal
      title={t('Enable')}
      isLoading={isApproving}
      headerBackground={theme.colors.gradients.cardHeader}
      txHash={txHashEnablingResult}
      loadingText={t('Please enable CAKE spending in yout wallet')}
      loadingButtonLabel={t('Enabling...')}
      successButtonLabel={t('Close')}
      onConfirmClose={onConfirmClose}
    />,
    false,
  )

  const [onPresentBuyTicketsModal, onDismissBuyTicketsModal] = useModal(
    <BuyTicketsModal
      title={t('Buy Minting Tickets')}
      buyTicketCallBack={handleConfirm}
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

  useEffect(() => txHashEnablingResult && onPresentEnableModal(), [txHashEnablingResult])
  useEffect(() => txHashBuyingResult && onPresentConfirmModal(), [txHashBuyingResult])
  useEffect(() => hasApproveFailed && onDismissEnableModal(), [hasApproveFailed])
  useEffect(() => hasConfirmFailed && onDismissBuyTicketsModal(), [hasConfirmFailed])
  useEffect(() => isApproved && setIsUserEnabled && setIsUserEnabled(isApproved), [isApproved, setIsUserEnabled])

  const handleEnableClick = () => {
    onPresentEnableModal()
    handleApprove()
  }

  const canBuyTickets = (canClaimForGen0 || canBuySaleTicket) && isUserEnabled
  const buyButton = getBuyButton({
    isApproved: isUserEnabled,
    isGen0User,
    saleStatus,
    startTimestamp,
    isUserReady,
    numberTicketsUsedForGen0,
  })

  return (
    <>
      {buyButton === BuyButtonsEnum.ENABLE && (
        <Button width="100%" onClick={handleEnableClick}>
          {t('Enable')}
        </Button>
      )}
      {buyButton === BuyButtonsEnum.READY && (
        <ReadyText text={t(isGen0User ? 'Ready for Pre-Sale!' : 'Ready for Public Sale!')} />
      )}
      {buyButton === BuyButtonsEnum.BUY && (
        <Button width="100%" onClick={onPresentBuyTicketsModal} disabled={!canBuyTickets}>
          {getBuyButtonText({ canBuyTickets, numberTicketsOfUser, saleStatus, t })}
        </Button>
      )}
    </>
  )
}

export default BuyTicketsButtons
