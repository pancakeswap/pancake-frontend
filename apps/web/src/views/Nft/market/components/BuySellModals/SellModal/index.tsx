import { ContextApi, useTranslation } from '@pancakeswap/localization'
import { InjectedModalProps, useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useErc721CollectionContract, useNftMarketContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { useState } from 'react'
import { NftToken } from 'state/nftMarket/types'
import { Address, isAddress, parseUnits } from 'viem'
import { useGetLowestPriceFromNft } from 'views/Nft/market/hooks/useGetLowestPrice'
import { useAccount } from 'wagmi'
import ApproveAndConfirmStage from '../shared/ApproveAndConfirmStage'
import ConfirmStage from '../shared/ConfirmStage'
import TransactionConfirmed from '../shared/TransactionConfirmed'
import EditStage from './EditStage'
import RemoveStage from './RemoveStage'
import SellStage from './SellStage'
import SetPriceStage from './SetPriceStage'
import TransferStage from './TransferStage'
import { StyledModal, stagesWithBackButton } from './styles'
import { SellingStage } from './types'

export const modalTitles = (stage: SellingStage, t: ContextApi['t']) => {
  switch (stage) {
    // Sell flow
    case SellingStage.SELL:
      return t('Details')
    case SellingStage.SET_PRICE:
    case SellingStage.APPROVE_AND_CONFIRM_SELL:
      return t('Back')
    // Adjust price flow
    case SellingStage.EDIT:
      return t('Details')
    case SellingStage.ADJUST_PRICE:
      return t('Back')
    case SellingStage.CONFIRM_ADJUST_PRICE:
      return t('Confirm transaction')
    // Remove from market flow
    case SellingStage.REMOVE_FROM_MARKET:
      return t('Back')
    case SellingStage.CONFIRM_REMOVE_FROM_MARKET:
      return t('Confirm transaction')
    // Transfer flow
    case SellingStage.TRANSFER:
      return t('Back')
    case SellingStage.CONFIRM_TRANSFER:
      return t('Confirm transaction')
    // Common
    case SellingStage.TX_CONFIRMED:
      return t('Transaction Confirmed')
    default:
      return ''
  }
}

const getToastText = (variant: string, stage: SellingStage, t: ContextApi['t']) => {
  if (stage === SellingStage.CONFIRM_REMOVE_FROM_MARKET) {
    return t('Your NFT has been returned to your wallet')
  }
  if (stage === SellingStage.CONFIRM_TRANSFER) {
    return t('Your NFT has been transferred to another wallet')
  }
  if (variant === 'sell') {
    return t('Your NFT has been listed for sale!')
  }
  return t('Your NFT listing has been changed.')
}

interface SellModalProps extends InjectedModalProps {
  variant?: 'sell' | 'edit'
  nftToSell?: NftToken
  onSuccessSale: () => void
  onSuccessEditProfile?: () => void
}

const SellModal: React.FC<React.PropsWithChildren<SellModalProps>> = ({
  variant,
  nftToSell,
  onDismiss,
  onSuccessSale,
  onSuccessEditProfile,
}) => {
  const [stage, setStage] = useState(variant === 'sell' ? SellingStage.SELL : SellingStage.EDIT)
  const [price, setPrice] = useState<string>(variant === 'sell' ? '' : nftToSell?.marketData?.currentAskPrice ?? '')
  const [transferAddress, setTransferAddress] = useState('')
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { address: account } = useAccount()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const collectionContract = useErc721CollectionContract(nftToSell?.collectionAddress)
  const nftMarketContract = useNftMarketContract()

  const isInvalidTransferAddress = !transferAddress || (transferAddress.length > 0 && !isAddress(transferAddress))

  const { lowestPrice } = useGetLowestPriceFromNft(nftToSell)

  const goBack = () => {
    switch (stage) {
      case SellingStage.SET_PRICE:
        setStage(SellingStage.SELL)
        break
      case SellingStage.APPROVE_AND_CONFIRM_SELL:
        setStage(SellingStage.SET_PRICE)
        break
      case SellingStage.ADJUST_PRICE:
        if (nftToSell?.marketData?.currentAskPrice) setPrice(nftToSell?.marketData?.currentAskPrice)
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_ADJUST_PRICE:
        setStage(SellingStage.ADJUST_PRICE)
        break
      case SellingStage.REMOVE_FROM_MARKET:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_REMOVE_FROM_MARKET:
        setStage(SellingStage.REMOVE_FROM_MARKET)
        break
      case SellingStage.TRANSFER:
        setStage(SellingStage.SELL)
        break
      case SellingStage.CONFIRM_TRANSFER:
        setStage(SellingStage.TRANSFER)
        break
      default:
        break
    }
  }

  const continueToNextStage = () => {
    switch (stage) {
      case SellingStage.SELL:
        setStage(SellingStage.SET_PRICE)
        break
      case SellingStage.SET_PRICE:
        setStage(SellingStage.APPROVE_AND_CONFIRM_SELL)
        break
      case SellingStage.EDIT:
        setStage(SellingStage.ADJUST_PRICE)
        break
      case SellingStage.ADJUST_PRICE:
        setStage(SellingStage.CONFIRM_ADJUST_PRICE)
        break
      case SellingStage.REMOVE_FROM_MARKET:
        setStage(SellingStage.CONFIRM_REMOVE_FROM_MARKET)
        break
      case SellingStage.TRANSFER:
        setStage(SellingStage.CONFIRM_TRANSFER)
        break
      default:
        break
    }
  }

  const continueToRemoveFromMarketStage = () => {
    setStage(SellingStage.REMOVE_FROM_MARKET)
  }

  const continueToTransferStage = () => {
    setStage(SellingStage.TRANSFER)
  }

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      if (!account) return true
      try {
        const approvedForContract = await collectionContract?.read.isApprovedForAll([
          account,
          nftMarketContract.address,
        ])
        return !approvedForContract
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(collectionContract, 'setApprovalForAll', [nftMarketContract.address, true])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now put your NFT for sale!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    onConfirm: () => {
      if (!nftToSell) return undefined
      if (stage === SellingStage.CONFIRM_REMOVE_FROM_MARKET) {
        return callWithGasPrice(nftMarketContract, 'cancelAskOrder', [
          nftToSell.collectionAddress,
          BigInt(nftToSell.tokenId),
        ])
      }
      if (stage === SellingStage.CONFIRM_TRANSFER) {
        if (account)
          return callWithGasPrice(collectionContract, 'safeTransferFrom', [
            account,
            transferAddress as Address,
            BigInt(nftToSell.tokenId),
          ])
      }
      const methodName = variant === 'sell' ? 'createAskOrder' : 'modifyAskOrder'
      const askPrice = parseUnits(price as `${number}`, 18)
      return callWithGasPrice(nftMarketContract, methodName, [
        nftToSell.collectionAddress,
        BigInt(nftToSell.tokenId),
        askPrice,
      ])
    },
    onSuccess: async ({ receipt }) => {
      if (!variant) return
      toastSuccess(getToastText(variant, stage, t), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      onSuccessSale()
      setConfirmedTxHash(receipt.transactionHash)
      setStage(SellingStage.TX_CONFIRMED)
    },
  })

  const showBackButton = stagesWithBackButton.includes(stage) && !isConfirming && !isApproving

  if (!nftToSell) return null

  return (
    <StyledModal
      title={modalTitles(stage, t)}
      stage={stage}
      onDismiss={onDismiss}
      onBack={showBackButton ? goBack : undefined}
      headerBackground={theme.colors.gradientCardHeader}
    >
      {stage === SellingStage.SELL && (
        <SellStage
          nftToSell={nftToSell}
          lowestPrice={lowestPrice ?? 0}
          continueToNextStage={continueToNextStage}
          continueToTransferStage={continueToTransferStage}
          onSuccessEditProfile={onSuccessEditProfile}
        />
      )}
      {stage === SellingStage.SET_PRICE && (
        <SetPriceStage
          nftToSell={nftToSell}
          variant="set"
          continueToNextStage={continueToNextStage}
          lowestPrice={lowestPrice}
          price={price}
          setPrice={setPrice}
        />
      )}
      {stage === SellingStage.APPROVE_AND_CONFIRM_SELL && (
        <ApproveAndConfirmStage
          variant="sell"
          isApproved={isApproved}
          isApproving={isApproving}
          isConfirming={isConfirming}
          handleApprove={handleApprove}
          handleConfirm={handleConfirm}
        />
      )}
      {stage === SellingStage.TX_CONFIRMED && <TransactionConfirmed txHash={confirmedTxHash} onDismiss={onDismiss} />}
      {stage === SellingStage.EDIT && (
        <EditStage
          nftToSell={nftToSell}
          lowestPrice={lowestPrice}
          continueToAdjustPriceStage={continueToNextStage}
          continueToRemoveFromMarketStage={continueToRemoveFromMarketStage}
        />
      )}
      {stage === SellingStage.ADJUST_PRICE && (
        <SetPriceStage
          nftToSell={nftToSell}
          variant="adjust"
          continueToNextStage={continueToNextStage}
          currentPrice={nftToSell?.marketData?.currentAskPrice}
          lowestPrice={lowestPrice}
          price={price}
          setPrice={setPrice}
        />
      )}
      {stage === SellingStage.CONFIRM_ADJUST_PRICE && (
        <ConfirmStage isConfirming={isConfirming} handleConfirm={handleConfirm} />
      )}
      {stage === SellingStage.REMOVE_FROM_MARKET && <RemoveStage continueToNextStage={continueToNextStage} />}
      {stage === SellingStage.CONFIRM_REMOVE_FROM_MARKET && (
        <ConfirmStage isConfirming={isConfirming} handleConfirm={handleConfirm} />
      )}
      {stage === SellingStage.TRANSFER && (
        <TransferStage
          nftToSell={nftToSell}
          lowestPrice={lowestPrice}
          continueToNextStage={continueToNextStage}
          transferAddress={transferAddress}
          setTransferAddress={setTransferAddress}
          isInvalidTransferAddress={isInvalidTransferAddress}
        />
      )}
      {stage === SellingStage.CONFIRM_TRANSFER && (
        <ConfirmStage isConfirming={isConfirming} handleConfirm={handleConfirm} />
      )}
    </StyledModal>
  )
}

export default SellModal
