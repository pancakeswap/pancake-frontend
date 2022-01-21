import React, { useState } from 'react'
import { InjectedModalProps } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { parseUnits } from '@ethersproject/units'
import useTheme from 'hooks/useTheme'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useToast from 'hooks/useToast'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useTranslation } from 'contexts/Localization'
import { ContextApi } from 'contexts/Localization/types'
import { isAddress } from 'utils'
import { useErc721CollectionContract, useNftMarketContract } from 'hooks/useContract'
import { NftToken } from 'state/nftMarket/types'
import { useGetLowestPriceFromNft } from 'views/Nft/market/hooks/useGetLowestPrice'
import SellStage from './SellStage'
import SetPriceStage from './SetPriceStage'
import EditStage from './EditStage'
import ApproveAndConfirmStage from '../shared/ApproveAndConfirmStage'
import TransactionConfirmed from '../shared/TransactionConfirmed'
import { StyledModal, stagesWithBackButton } from './styles'
import { SellingStage } from './types'
import ConfirmStage from '../shared/ConfirmStage'
import RemoveStage from './RemoveStage'
import TransferStage from './TransferStage'

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
  variant: 'sell' | 'edit'
  nftToSell: NftToken
  onSuccessSale: () => void
  onSuccessEditProfile?: () => void
}

const SellModal: React.FC<SellModalProps> = ({
  variant,
  nftToSell,
  onDismiss,
  onSuccessSale,
  onSuccessEditProfile,
}) => {
  const [stage, setStage] = useState(variant === 'sell' ? SellingStage.SELL : SellingStage.EDIT)
  const [price, setPrice] = useState(variant === 'sell' ? '' : nftToSell.marketData.currentAskPrice)
  const [transferAddress, setTransferAddress] = useState('')
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const collectionContract = useErc721CollectionContract(nftToSell.collectionAddress)
  const nftMarketContract = useNftMarketContract()

  const isInvalidTransferAddress = transferAddress.length > 0 && !isAddress(transferAddress)

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
        setPrice(nftToSell.marketData.currentAskPrice)
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
      try {
        const approvedForContract = await collectionContract.isApprovedForAll(account, nftMarketContract.address)
        return approvedForContract
      } catch (error) {
        return false
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
      if (stage === SellingStage.CONFIRM_REMOVE_FROM_MARKET) {
        return callWithGasPrice(nftMarketContract, 'cancelAskOrder', [nftToSell.collectionAddress, nftToSell.tokenId])
      }
      if (stage === SellingStage.CONFIRM_TRANSFER) {
        return callWithGasPrice(collectionContract, 'safeTransferFrom(address,address,uint256)', [
          account,
          transferAddress,
          nftToSell.tokenId,
        ])
      }
      const methodName = variant === 'sell' ? 'createAskOrder' : 'modifyAskOrder'
      const askPrice = parseUnits(price)
      return callWithGasPrice(nftMarketContract, methodName, [nftToSell.collectionAddress, nftToSell.tokenId, askPrice])
    },
    onSuccess: async ({ receipt }) => {
      toastSuccess(getToastText(variant, stage, t), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      onSuccessSale()
      setConfirmedTxHash(receipt.transactionHash)
      setStage(SellingStage.TX_CONFIRMED)
    },
  })

  const showBackButton = stagesWithBackButton.includes(stage) && !isConfirming && !isApproving

  return (
    <StyledModal
      title={modalTitles(stage, t)}
      stage={stage}
      onDismiss={onDismiss}
      onBack={showBackButton ? goBack : null}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      {stage === SellingStage.SELL && (
        <SellStage
          nftToSell={nftToSell}
          lowestPrice={lowestPrice}
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
          currentPrice={nftToSell.marketData.currentAskPrice}
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
