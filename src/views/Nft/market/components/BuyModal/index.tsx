import React, { useState } from 'react'
import { InjectedModalProps } from '@pancakeswap/uikit'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import useTheme from 'hooks/useTheme'
import { useTranslation } from 'contexts/Localization'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { formatBigNumberToFixed, getBalanceNumber } from 'utils/formatBalance'
import { testnetTokens } from 'config/constants/tokens'
import { parseUnits } from 'ethers/lib/utils'
import { useERC20, useNftMarketContract } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { StyledModal } from './styles'
import ReviewStage from './ReviewStage'
import ConfirmStage from './ConfirmStage'
import ApproveAndConfirmStage from './ApproveAndConfirmStage'
import { PaymentCurrency, BuyingStage } from './types'
import TransactionSubmitted from './TransactionSubmitted'

interface BuyModalProps extends InjectedModalProps {
  nftToBuy: any
}

const BuyModal: React.FC<BuyModalProps> = ({ nftToBuy, onDismiss }) => {
  const [stage, setStage] = useState(BuyingStage.REVIEW)
  const [paymentCurrency, setPaymentCurrency] = useState<PaymentCurrency>(PaymentCurrency.BNB)
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { callWithGasPrice } = useCallWithGasPrice()

  const { account } = useWeb3React()
  const wbnbContract = useERC20(testnetTokens.wbnb.address)
  const nftMarketContract = useNftMarketContract()

  const nftPriceWei = parseUnits(nftToBuy.token.currentAskPrice, 'ether')
  const nftPrice = parseFloat(formatBigNumberToFixed(nftPriceWei, 3))

  // BNB
  const { balance: bnbBalance, fetchStatus: bnbFetchStatus } = useGetBnbBalance()
  const formattedBnbBalance = parseFloat(formatBigNumberToFixed(bnbBalance, 3))
  // WBNB
  const { balance: wbnbBalance, fetchStatus: wbnbFetchStatus } = useTokenBalance(testnetTokens.wbnb.address)
  const formattedWbnbBalance = getBalanceNumber(wbnbBalance)

  const walletBalance = paymentCurrency === PaymentCurrency.BNB ? formattedBnbBalance : formattedWbnbBalance
  const walletFetchStatus = paymentCurrency === PaymentCurrency.BNB ? bnbFetchStatus : wbnbFetchStatus

  const notEnoughBnbForPurchase =
    paymentCurrency === PaymentCurrency.BNB
      ? bnbBalance.lt(nftPriceWei)
      : wbnbBalance.lt(new BigNumber(nftPriceWei.toString()))

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        try {
          const currentAllowance = await wbnbContract.allowance(account, nftMarketContract.address)
          return currentAllowance.gt(0)
        } catch (error) {
          return false
        }
      },
      onApprove: () => {
        return callWithGasPrice(wbnbContract, 'approve', [nftMarketContract.address, ethers.constants.MaxUint256])
      },
      onApproveSuccess: async ({ receipt }) => {
        console.info('Approve success', receipt)
      },
      onConfirm: () => {
        const payAmount = Number.isNaN(parseFloat(nftToBuy.token.currentAskPrice))
          ? ethers.BigNumber.from(0)
          : parseUnits(nftToBuy.token.currentAskPrice)
        console.log('On confirm!', Number(payAmount), nftToBuy.token.currentAskPrice)
        if (paymentCurrency === PaymentCurrency.BNB) {
          return callWithGasPrice(
            nftMarketContract,
            'buyTokenUsingBNB',
            [nftToBuy.collection.address, nftToBuy.token.tokenId],
            { value: payAmount },
          )
        }
        console.log('paying with WBNB', nftToBuy.collection.address, nftToBuy.token.tokenId, payAmount)
        return callWithGasPrice(nftMarketContract, 'buyTokenUsingWBNB', [
          nftToBuy.collection.address,
          nftToBuy.token.tokenId,
          payAmount,
        ])
      },
      onSuccess: async ({ receipt }) => {
        console.info('onSuccess', receipt)
      },
    })

  const continueToNextStage = () => {
    if (paymentCurrency === PaymentCurrency.WBNB && !isApproved) {
      setStage(BuyingStage.APPROVE_AND_CONFIRM)
    } else {
      setStage(BuyingStage.CONFIRM)
    }
  }

  const goBack = () => {
    setStage(BuyingStage.REVIEW)
  }

  // TODO titles
  return (
    <StyledModal
      title={t('Review')}
      onDismiss={onDismiss}
      onBack={stage !== BuyingStage.REVIEW ? goBack : null}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      {stage === BuyingStage.REVIEW && (
        <ReviewStage
          nftToBuy={nftToBuy}
          paymentCurrency={paymentCurrency}
          setPaymentCurrency={setPaymentCurrency}
          nftPrice={nftPrice}
          walletBalance={walletBalance}
          walletFetchStatus={walletFetchStatus}
          notEnoughBnbForPurchase={notEnoughBnbForPurchase}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === BuyingStage.APPROVE_AND_CONFIRM && (
        <ApproveAndConfirmStage
          handleApprove={handleApprove}
          isApproved={isApproved}
          isApproving={isApproving}
          isConfirmed={isConfirmed}
          isConfirming={isConfirming}
          handleConfirm={handleConfirm}
        />
      )}
      {stage === BuyingStage.CONFIRM && (
        <ConfirmStage isConfirmed={isConfirmed} isConfirming={isConfirming} handleConfirm={handleConfirm} />
      )}
      {stage === BuyingStage.TX_SUBMITTED && <TransactionSubmitted tx="123" />}
    </StyledModal>
  )
}

export default BuyModal
