import React, { useEffect, useState } from 'react'
import { Button, Flex, useModal } from '@pancakeswap/uikit'
import { ethers } from 'ethers'
import { BigNumber } from '@ethersproject/bignumber'
import { ContextApi } from 'contexts/Localization/types'
import { DefaultTheme } from 'styled-components'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { ethersToBigNumber } from 'utils/bigNumber'
import { useCake, useNftSaleContract } from 'hooks/useContract'
import { SaleStatusEnum, UserStatusEnum } from '../../types'
import ConfirmModal from '../Modals/Confirm'
import BuyTicketsModal from '../Modals/BuyTickets'
import ReadyText from './ReadyText'

type PreEventProps = {
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
  maxSupply: number
  totalSupplyMinted: number
  numberTokensOfUser: number
  cakeBalance: BigNumber
  pricePerTicket: BigNumber
  ticketsOfUser: number[]
}

const CtaButtons: React.FC<PreEventProps> = ({
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
  numberTokensOfUser,
  maxSupply,
  totalSupplyMinted,
  cakeBalance,
  pricePerTicket,
  ticketsOfUser,
}) => {
  const [transactionEnablingIdResult, setTransactionEnablingIdResult] = useState(null)
  const [transactionBuyingIdResult, setTransactionBuyingIdResult] = useState(null)
  const { callWithGasPrice } = useCallWithGasPrice()
  const nftSaleContract = useNftSaleContract()
  const cakeContract = useCake()

  const isUserUnconnected = userStatus === UserStatusEnum.UNCONNECTED
  const isUserUnactiveProfile = userStatus === UserStatusEnum.NO_PROFILE
  const canBuySaleTicket =
    saleStatus === SaleStatusEnum.Sale && numberTicketsOfUser - numberTicketsUsedForGen0 < maxPerAddress
  const canMintTickets = saleStatus === SaleStatusEnum.Claim && numberTicketsOfUser > 0
  const hasSquad = saleStatus === SaleStatusEnum.Claim && numberTokensOfUser > 0
  const canViewMarket = maxSupply === totalSupplyMinted
  const isPreSale = saleStatus === SaleStatusEnum.Presale

  const mintTokenCallBack = async () => {
    const receipt = await callWithGasPrice(nftSaleContract, 'mint', ticketsOfUser)
  }

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
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
        setTransactionEnablingIdResult(receipt.transactionHash)
        //   <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      },
      onConfirm: ({ ticketsNumber }) => {
        return callWithGasPrice(nftSaleContract, isPreSale ? 'buyTicketsInPreSaleForGen0' : 'buyTickets', [
          ticketsNumber,
        ])
      },
      onSuccess: async ({ receipt }) => {
        setTransactionBuyingIdResult(receipt.transactionHash)
        // toastSuccess(t('Lottery tickets purchased!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      },
    })

  const [onPresentConfirmModal] = useModal(
    <ConfirmModal
      title={t('Confirm')}
      isLoading={isConfirming}
      headerBackground={theme.colors.gradients.cardHeader}
      transactionId={transactionBuyingIdResult}
      loadingText={t('Please enable WBNB spending in your wallet')}
      loadingButtonLabel={t('Confirming...')}
      successButtonLabel={t('Mint more')}
    />,
  )

  const [onPresentEnableModal] = useModal(
    <ConfirmModal
      title={t('Enable')}
      isLoading={isApproving}
      headerBackground={theme.colors.gradients.cardHeader}
      transactionId={transactionEnablingIdResult}
      loadingText={t('Please enable CAKE spending in yout wallet')}
      loadingButtonLabel={t('Enabling...')}
      successButtonLabel={t('Close')}
    />,
  )

  const [onPresentBuyTicketsModal] = useModal(
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

  useEffect(
    () => transactionBuyingIdResult && onPresentConfirmModal(),
    [transactionBuyingIdResult, onPresentConfirmModal],
  )
  useEffect(
    () => transactionEnablingIdResult && onPresentEnableModal(),
    [transactionEnablingIdResult, onPresentEnableModal],
  )

  const handleEnableClick = () => {
    onPresentEnableModal()
    handleApprove()
  }

  return (
    <>
      <Flex>
        {isUserUnconnected && <ConnectWalletButton scale="sm" />}
        {isUserUnactiveProfile && <Button scale="sm">{t('Activate Profile')}</Button>}
        {!isApproved && (
          <Button scale="sm" onClick={handleEnableClick}>
            {t('Enable')}
          </Button>
        )}
        {(canClaimForGen0 || canBuySaleTicket) && isApproved && (
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
      <ReadyText t={t} userStatus={userStatus} saleStatus={saleStatus} isApproved={isApproved} />
    </>
  )
}

export default CtaButtons
