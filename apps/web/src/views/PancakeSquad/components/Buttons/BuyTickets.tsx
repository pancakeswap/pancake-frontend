/* eslint-disable react-hooks/exhaustive-deps */
import { ContextApi } from '@pancakeswap/localization'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { bscTokens } from '@pancakeswap/tokens'
import { Button, useModal, useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useNftSaleContract } from 'hooks/useContract'
import { useContext, useEffect, useState } from 'react'
import { DefaultTheme } from 'styled-components'
import { Address, Hash } from 'viem'
import { PancakeSquadContext } from 'views/PancakeSquad/context'
import { SaleStatusEnum, UserStatusEnum } from '../../types'
import ReadyText from '../Header/ReadyText'
import BuyTicketsModal from '../Modals/BuyTickets'
import ConfirmModal from '../Modals/Confirm'
import { BuyButtonsEnum } from './types'
import { getBuyButton, getBuyButtonText } from './utils'

type BuyTicketsProps = {
  t: ContextApi['t']
  account?: Address
  saleStatus: SaleStatusEnum
  userStatus: UserStatusEnum
  theme: DefaultTheme
  canClaimForGen0: boolean
  maxPerAddress?: number
  maxPerTransaction?: number
  numberTicketsOfUser?: number
  numberTicketsForGen0?: number
  numberTicketsUsedForGen0?: number
  cakeBalance: bigint
  pricePerTicket: bigint
  startTimestamp: number
}

const BuyTicketsButtons: React.FC<React.PropsWithChildren<BuyTicketsProps>> = ({
  t,
  saleStatus,
  userStatus,
  theme,
  canClaimForGen0 = 0,
  maxPerAddress = 0,
  maxPerTransaction = 0,
  numberTicketsOfUser = 0,
  numberTicketsForGen0 = 0,
  numberTicketsUsedForGen0 = 0,
  cakeBalance,
  pricePerTicket,
  startTimestamp,
}) => {
  const [txHashEnablingResult, setTxHashEnablingResult] = useState<Hash | null>(null)
  const [txHashBuyingResult, setTxHashBuyingResult] = useState<Hash | null>(null)
  const { callWithGasPrice } = useCallWithGasPrice()
  const nftSaleContract = useNftSaleContract()
  const { toastSuccess } = useToast()
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
      token: bscTokens.cake,
      minAmount: MaxUint256,
      spender: nftSaleContract.address,
      onApproveSuccess: async ({ receipt }) => {
        toastSuccess(t('Transaction has succeeded!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
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
      headerBackground={theme.colors.gradientCardHeader}
      txHash={txHashBuyingResult ?? undefined}
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
      headerBackground={theme.colors.gradientCardHeader}
      txHash={txHashEnablingResult ?? undefined}
      loadingText={t('Please enable CAKE spending in your wallet')}
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
      headerBackground={theme.colors.gradientCardHeader}
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

  useEffect(() => {
    if (txHashEnablingResult) {
      onPresentEnableModal()
    }
  }, [txHashEnablingResult])
  useEffect(() => {
    if (txHashBuyingResult) {
      onPresentConfirmModal()
    }
  }, [txHashBuyingResult])
  useEffect(() => {
    if (hasApproveFailed) {
      onDismissEnableModal()
    }
  }, [hasApproveFailed])
  useEffect(() => {
    if (hasConfirmFailed) {
      onDismissBuyTicketsModal()
    }
  }, [hasConfirmFailed])
  useEffect(() => {
    if (isApproved && setIsUserEnabled) {
      setIsUserEnabled(isApproved)
    }
  }, [isApproved, setIsUserEnabled])

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
        <ReadyText text={isGen0User ? t('Ready for Pre-Sale!') : t('Ready for Public Sale!')} />
      )}
      {buyButton === BuyButtonsEnum.BUY && (
        <Button width="100%" onClick={onPresentBuyTicketsModal} disabled={!canBuyTickets}>
          {getBuyButtonText({ canBuyTickets: Boolean(canBuyTickets), numberTicketsOfUser, saleStatus, t })}
        </Button>
      )}
    </>
  )
}

export default BuyTicketsButtons
