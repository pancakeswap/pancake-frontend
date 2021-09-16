/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Button, Flex, useModal } from '@pancakeswap/uikit'
import { ethers } from 'ethers'
import { BigNumber } from '@ethersproject/bignumber'
import { ContextApi } from 'contexts/Localization/types'
import { DefaultTheme } from 'styled-components'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { Link } from 'react-router-dom'
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
  maxPerAddress: BigNumber
  maxPerTransaction: BigNumber
  numberTicketsOfUser: BigNumber
  numberTicketsForGen0: BigNumber
  numberTicketsUsedForGen0: BigNumber
  maxSupply: BigNumber
  totalSupplyMinted: BigNumber
  numberTokensOfUser: BigNumber
  cakeBalance: BigNumber
  pricePerTicket: BigNumber
  ticketsOfUser: BigNumber[]
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
  const [txHashEnablingResult, setTxHashEnablingResult] = useState(null)
  const [txHashBuyingResult, setTxHashBuyingResult] = useState(null)
  const { callWithGasPrice } = useCallWithGasPrice()
  const nftSaleContract = useNftSaleContract()
  const cakeContract = useCake()

  const zero = BigNumber.from(0)
  const isUserUnconnected = userStatus === UserStatusEnum.UNCONNECTED
  const isUserUnactiveProfile = userStatus === UserStatusEnum.NO_PROFILE
  const canBuySaleTicket =
    saleStatus === SaleStatusEnum.Sale && numberTicketsOfUser.sub(numberTicketsUsedForGen0).lt(maxPerAddress)
  const canMintTickets = saleStatus === SaleStatusEnum.Claim && numberTicketsOfUser.gt(zero)
  const hasSquad = saleStatus === SaleStatusEnum.Claim && numberTokensOfUser.gt(zero)
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
        setTxHashEnablingResult(receipt.transactionHash)
      },
      onConfirm: ({ ticketsNumber }) => {
        return callWithGasPrice(nftSaleContract, isPreSale ? 'buyTicketsInPreSaleForGen0' : 'buyTickets', [
          ticketsNumber,
        ])
      },
      onSuccess: async ({ receipt }) => {
        setTxHashBuyingResult(receipt.transactionHash)
      },
    })

  const [onPresentConfirmModal] = useModal(
    <ConfirmModal
      title={t('Confirm')}
      isLoading={isConfirming}
      headerBackground={theme.colors.gradients.cardHeader}
      txHash={txHashBuyingResult}
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
      txHash={txHashEnablingResult}
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

  useEffect(() => txHashEnablingResult && onPresentEnableModal(), [txHashEnablingResult])
  useEffect(() => txHashBuyingResult && onPresentConfirmModal(), [txHashBuyingResult])

  const handleEnableClick = () => {
    onPresentEnableModal()
    handleApprove()
  }

  return (
    <>
      <Flex>
        {isUserUnconnected && <ConnectWalletButton scale="sm" />}
        {isUserUnactiveProfile && (
          <Button as={Link} to="/profile" scale="sm">
            {t('Activate Profile')}
          </Button>
        )}
        {isApproved && !isUserUnactiveProfile && (
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
