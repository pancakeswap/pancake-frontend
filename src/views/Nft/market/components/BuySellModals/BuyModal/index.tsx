import { MaxUint256, Zero } from '@ethersproject/constants'
import { formatEther, parseUnits } from '@ethersproject/units'
import { InjectedModalProps } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { ToastDescriptionWithTx } from 'components/Toast'
import tokens from 'config/constants/tokens'
import { TranslateFunction, useTranslation } from 'contexts/Localization'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useERC20, useNftMarketContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { useEffect, useState } from 'react'
import { NftToken } from 'state/nftMarket/types'
import ApproveAndConfirmStage from '../shared/ApproveAndConfirmStage'
import ConfirmStage from '../shared/ConfirmStage'
import TransactionConfirmed from '../shared/TransactionConfirmed'
import ReviewStage from './ReviewStage'
import { StyledModal } from './styles'
import { BuyingStage, PaymentCurrency } from './types'

const modalTitles = (t: TranslateFunction) => ({
  [BuyingStage.REVIEW]: t('Review'),
  [BuyingStage.APPROVE_AND_CONFIRM]: t('Back'),
  [BuyingStage.CONFIRM]: t('Back'),
  [BuyingStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  nftToBuy: NftToken
}

const BuyModal: React.FC<BuyModalProps> = ({ nftToBuy, onDismiss }) => {
  const [stage, setStage] = useState(BuyingStage.REVIEW)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const [paymentCurrency, setPaymentCurrency] = useState<PaymentCurrency>(PaymentCurrency.BNB)
  const [isPaymentCurrentInitialized, setIsPaymentCurrentInitialized] = useState(false)
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { callWithGasPrice } = useCallWithGasPrice()

  const { account } = useWeb3React()
  const wbnbContractReader = useERC20(tokens.wbnb.address, false)
  const wbnbContractApprover = useERC20(tokens.wbnb.address)
  const nftMarketContract = useNftMarketContract()

  const { toastSuccess } = useToast()

  const nftPriceWei = parseUnits(nftToBuy.marketData.currentAskPrice, 'ether')
  const nftPrice = parseFloat(nftToBuy.marketData.currentAskPrice)

  const { balance: bnbBalance, fetchStatus: bnbFetchStatus } = useGetBnbBalance()
  const formattedBnbBalance = parseFloat(formatEther(bnbBalance))
  const { balance: wbnbBalance, fetchStatus: wbnbFetchStatus } = useTokenBalance(tokens.wbnb.address)
  const formattedWbnbBalance = parseFloat(formatEther(wbnbBalance))

  const walletBalance = paymentCurrency === PaymentCurrency.BNB ? formattedBnbBalance : formattedWbnbBalance
  const walletFetchStatus = paymentCurrency === PaymentCurrency.BNB ? bnbFetchStatus : wbnbFetchStatus

  const notEnoughBnbForPurchase =
    paymentCurrency === PaymentCurrency.BNB ? bnbBalance.lt(nftPriceWei) : wbnbBalance.lt(nftPriceWei)

  useEffect(() => {
    if (bnbBalance.lt(nftPriceWei) && wbnbBalance.gte(nftPriceWei) && !isPaymentCurrentInitialized) {
      setPaymentCurrency(PaymentCurrency.WBNB)
      setIsPaymentCurrentInitialized(true)
    }
  }, [bnbBalance, wbnbBalance, nftPriceWei, isPaymentCurrentInitialized])

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        const currentAllowance = await wbnbContractReader.allowance(account, nftMarketContract.address)
        return currentAllowance.gt(0)
      } catch (error) {
        return false
      }
    },
    onApprove: () => {
      return callWithGasPrice(wbnbContractApprover, 'approve', [nftMarketContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now buy NFT with WBNB!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    onConfirm: () => {
      const payAmount = Number.isNaN(nftPrice) ? Zero : parseUnits(nftToBuy.marketData.currentAskPrice)
      if (paymentCurrency === PaymentCurrency.BNB) {
        return callWithGasPrice(nftMarketContract, 'buyTokenUsingBNB', [nftToBuy.collectionAddress, nftToBuy.tokenId], {
          value: payAmount,
        })
      }
      return callWithGasPrice(nftMarketContract, 'buyTokenUsingWBNB', [
        nftToBuy.collectionAddress,
        nftToBuy.tokenId,
        payAmount,
      ])
    },
    onSuccess: async ({ receipt }) => {
      setConfirmedTxHash(receipt.transactionHash)
      setStage(BuyingStage.TX_CONFIRMED)
      toastSuccess(
        t('Your NFT has been sent to your wallet'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
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

  const showBackButton = stage === BuyingStage.CONFIRM || stage === BuyingStage.APPROVE_AND_CONFIRM

  return (
    <StyledModal
      title={modalTitles(t)[stage]}
      stage={stage}
      onDismiss={onDismiss}
      onBack={showBackButton ? goBack : null}
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
          variant="buy"
          handleApprove={handleApprove}
          isApproved={isApproved}
          isApproving={isApproving}
          isConfirming={isConfirming}
          handleConfirm={handleConfirm}
        />
      )}
      {stage === BuyingStage.CONFIRM && <ConfirmStage isConfirming={isConfirming} handleConfirm={handleConfirm} />}
      {stage === BuyingStage.TX_CONFIRMED && <TransactionConfirmed txHash={confirmedTxHash} onDismiss={onDismiss} />}
    </StyledModal>
  )
}

export default BuyModal
