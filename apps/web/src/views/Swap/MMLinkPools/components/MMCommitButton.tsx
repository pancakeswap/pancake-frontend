import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'
import { Button, useModal } from '@pancakeswap/uikit'
import { logGTMClickSwapEvent } from 'utils/customGTMEventTracking'
import { SendTransactionResult } from 'wagmi/actions'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import SettingsModal, { withCustomOnDismiss } from 'components/Menu/GlobalSettings/SettingsModal'
import { SettingsMode } from 'components/Menu/GlobalSettings/types'
import { ApprovalState } from 'hooks/useApproveCallback'
import { WrapType } from 'hooks/useWrapCallback'
import { parseMMError } from 'views/Swap/MMLinkPools/utils/exchange'
import { useCallback, useEffect, useState } from 'react'
import { Field } from 'state/swap/actions'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useConfirmModalState } from 'views/Swap/V3Swap/hooks/useConfirmModalState'
import { useExpertMode } from '@pancakeswap/utils/user'
import { useSwapCallArguments } from '../hooks/useSwapCallArguments'
import { useSwapCallback } from '../hooks/useSwapCallback'
import { MMRfqTrade } from '../types'
import { ConfirmSwapModal } from '../../V3Swap/containers/ConfirmSwapModal'

const SettingsModalWithCustomDismiss = withCustomOnDismiss(SettingsModal)

interface SwapCommitButtonPropsType {
  swapIsUnsupported: boolean
  account: string
  showWrap: boolean
  wrapInputError: string
  onWrap: () => Promise<void>
  wrapType: WrapType
  approval: ApprovalState
  approveCallback: () => Promise<SendTransactionResult>
  revokeCallback: () => Promise<SendTransactionResult>
  approvalSubmitted: boolean
  currencies: {
    INPUT?: Currency
    OUTPUT?: Currency
  }
  isExpertMode: boolean
  rfqTrade: MMRfqTrade
  swapInputError: string
  currencyBalances: {
    INPUT?: CurrencyAmount<Currency>
    OUTPUT?: CurrencyAmount<Currency>
  }
  recipient: string
  onUserInput: (field: Field, typedValue: string) => void
  mmQuoteExpiryRemainingSec?: number | null
  isPendingError: boolean
  currentAllowance: CurrencyAmount<Currency>
}

export function MMSwapCommitButton({
  swapIsUnsupported,
  account,
  showWrap,
  wrapInputError,
  onWrap,
  wrapType,
  approval,
  approveCallback,
  revokeCallback,
  approvalSubmitted,
  rfqTrade,
  swapInputError,
  currencyBalances,
  recipient,
  onUserInput,
  isPendingError,
  currentAllowance,
}: SwapCommitButtonPropsType) {
  const { chainId } = useActiveChainId()

  const [isExpertMode] = useExpertMode()

  const { t } = useTranslation()
  // the callback to execute the swap

  // @ts-ignore
  const swapCalls = useSwapCallArguments(rfqTrade.trade, rfqTrade.rfq, recipient)

  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    rfqTrade.trade,
    recipient,
    // @ts-ignore
    swapCalls,
  )
  const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    tradeToConfirm?: SmartRouterTrade<TradeType>
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  // Handlers
  const handleSwap = useCallback(() => {
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: hash })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [swapCallback, tradeToConfirm, setSwapState])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: rfqTrade.trade, swapErrorMessage, txHash, attemptingTxn })
  }, [attemptingTxn, swapErrorMessage, rfqTrade, txHash, setSwapState])

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash, setSwapState])

  // End Handlers

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED))

  // Modals
  const [indirectlyOpenConfirmModalState, setIndirectlyOpenConfirmModalState] = useState(false)

  const [onPresentSettingsModal] = useModal(
    <SettingsModalWithCustomDismiss
      customOnDismiss={() => setIndirectlyOpenConfirmModalState(true)}
      mode={SettingsMode.SWAP_LIQUIDITY}
    />,
  )

  const { confirmModalState, pendingModalSteps, startSwapFlow, resetSwapFlow } = useConfirmModalState({
    txHash,
    chainId,
    approval,
    approvalToken: rfqTrade?.trade?.inputAmount.currency,
    isPendingError,
    isExpertMode,
    currentAllowance,
    approveCallback,
    revokeCallback,
    onConfirm: handleSwap,
  })

  const [onPresentConfirmModal] = useModal(
    <ConfirmSwapModal
      isMM
      trade={rfqTrade.trade} // show the info while refresh RFQ
      txHash={txHash}
      approval={approval}
      attemptingTxn={attemptingTxn}
      confirmModalState={confirmModalState}
      pendingModalSteps={pendingModalSteps}
      startSwapFlow={startSwapFlow}
      originalTrade={tradeToConfirm}
      showApproveFlow={showApproveFlow}
      currencyBalances={currencyBalances}
      isRFQReady={Boolean(rfqTrade.rfq) && !rfqTrade.isLoading}
      currentAllowance={currentAllowance}
      swapErrorMessage={swapErrorMessage || (!rfqTrade.trade && t('Unable request a quote'))}
      onAcceptChanges={handleAcceptChanges}
      customOnDismiss={handleConfirmDismiss}
      openSettingModal={onPresentSettingsModal}
    />,
    true,
    true,
    'MMconfirmSwapModal',
  )
  // End Modals

  const onSwapHandler = useCallback(() => {
    setSwapState({
      tradeToConfirm: rfqTrade.trade,
      attemptingTxn: false,
      swapErrorMessage: undefined,
      txHash: undefined,
    })
    resetSwapFlow()
    if (isExpertMode) {
      startSwapFlow()
    }
    onPresentConfirmModal()
    logGTMClickSwapEvent()
  }, [rfqTrade, onPresentConfirmModal, isExpertMode, startSwapFlow, resetSwapFlow])

  // useEffect
  useEffect(() => {
    if (indirectlyOpenConfirmModalState) {
      setIndirectlyOpenConfirmModalState(false)
      setSwapState((state) => ({
        ...state,
        swapErrorMessage: undefined,
      }))
      onPresentConfirmModal()
    }
  }, [indirectlyOpenConfirmModalState, onPresentConfirmModal, setSwapState])

  if (swapIsUnsupported) {
    return (
      <Button width="100%" disabled>
        {t('Unsupported Asset')}
      </Button>
    )
  }

  if (!account) {
    return <ConnectWalletButton width="100%" />
  }

  if (showWrap) {
    return (
      <CommitButton width="100%" disabled={Boolean(wrapInputError)} onClick={onWrap}>
        {wrapInputError ?? (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
      </CommitButton>
    )
  }

  const isValid = !swapInputError

  return (
    <CommitButton
      width="100%"
      id="swap-button"
      variant="primary"
      disabled={!rfqTrade.rfq || !isValid || !!swapCallbackError}
      onClick={onSwapHandler}
    >
      {parseMMError(swapInputError) || t('Swap')}
    </CommitButton>
  )
}
