import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'
import { SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { Button, useModal } from '@pancakeswap/uikit'
import { useExpertMode } from '@pancakeswap/utils/user'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import SettingsModal, { withCustomOnDismiss } from 'components/Menu/GlobalSettings/SettingsModal'
import { SettingsMode } from 'components/Menu/GlobalSettings/types'
import { usePermitOrApprove } from 'hooks/usePermitStatus'
import { WrapType } from 'hooks/useWrapCallback'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Field } from 'state/swap/actions'
import { logGTMClickSwapEvent } from 'utils/customGTMEventTracking'
import { isUserRejected } from 'utils/sentry'
import { Address } from 'viem'
import { parseMMError } from 'views/Swap/MMLinkPools/utils/exchange'
import { ConfirmSwapModal } from 'views/Swap/V3Swap/containers/ConfirmSwapModal'
import { useConfirmModalState } from 'views/Swap/V3Swap/hooks/useConfirmModalState'
import { TransactionRejectedError } from 'views/Swap/V3Swap/hooks/useSendSwapTransaction'
import { MMTradeInfo } from '../hooks'
import { useSwapCallArgumentsV2 } from '../hooks/useSwapCallArguments'
import { useSwapCallback } from '../hooks/useSwapCallback'
import { MMRfqTrade } from '../types'

const SettingsModalWithCustomDismiss = withCustomOnDismiss(SettingsModal)

interface SwapCommitButtonPropsType {
  mmTradeInfo: MMTradeInfo
  swapIsUnsupported: boolean
  account: Address | undefined
  showWrap: boolean
  wrapInputError?: string
  onWrap?: () => Promise<void>
  wrapType: WrapType
  // approval: ApprovalState
  // allowance: Allowance
  // approvalSubmitted: boolean
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
  recipient: string | null
  onUserInput: (field: Field, typedValue: string) => void
  mmQuoteExpiryRemainingSec?: number | null
  // isPendingError: boolean
  // currentAllowance?: CurrencyAmount<Currency>
}

export function MMSwapCommitButton({
  mmTradeInfo,
  swapIsUnsupported,
  account,
  showWrap,
  wrapInputError,
  onWrap,
  wrapType,
  rfqTrade,
  swapInputError,
  currencyBalances,
  recipient,
  onUserInput,
}: // isPendingError,
SwapCommitButtonPropsType) {
  const [isExpertMode] = useExpertMode()

  const { t } = useTranslation()
  // the callback to execute the swap
  const swapCalls = useSwapCallArgumentsV2(rfqTrade.trade, rfqTrade.rfq ?? undefined, recipient ?? undefined)

  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(rfqTrade.trade, recipient, swapCalls)
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

  const onConfirmSwap = useCallback(async () => {
    // @TODO should mm trade add price impact limit?

    if (!swapCallback) return undefined

    try {
      setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })
      const result = await swapCallback()
      setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: result.hash })
      return result
    } catch (error: any) {
      console.error(error)
      const userRejected =
        (typeof error !== 'string' && isUserRejected(error)) || error instanceof TransactionRejectedError

      if (!userRejected) {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: typeof error === 'string' ? error : error?.message,
          txHash: undefined,
        })
      }

      throw error
    }
  }, [swapCallback, tradeToConfirm])

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

  // Modals
  const [indirectlyOpenConfirmModalState, setIndirectlyOpenConfirmModalState] = useState(false)

  const [onPresentSettingsModal] = useModal(
    <SettingsModalWithCustomDismiss
      customOnDismiss={() => setIndirectlyOpenConfirmModalState(true)}
      mode={SettingsMode.SWAP_LIQUIDITY}
    />,
  )

  const amountToApprove = useMemo(() => {
    return mmTradeInfo?.slippageAdjustedAmounts[Field.INPUT]
  }, [mmTradeInfo])
  const mmSpender = useMemo(() => {
    return mmTradeInfo?.routerAddress as Address | undefined
  }, [mmTradeInfo])
  const { execute: onStep, approvalState } = usePermitOrApprove(amountToApprove, mmSpender, onConfirmSwap)

  const { confirmModalState, pendingModalSteps, resetConfirmModalState, startSwap } = useConfirmModalState(
    onStep,
    amountToApprove,
    approvalState,
    undefined,
    undefined,
    mmSpender,
  )

  const [onPresentConfirmModal] = useModal(
    <ConfirmSwapModal
      isMM
      trade={rfqTrade.trade} // show the info while refresh RFQ
      originalTrade={tradeToConfirm}
      txHash={txHash}
      confirmModalState={confirmModalState}
      pendingModalSteps={pendingModalSteps}
      onConfirm={startSwap}
      currencyBalances={currencyBalances}
      isRFQReady={Boolean(rfqTrade.rfq) && !rfqTrade.isLoading}
      swapErrorMessage={swapErrorMessage || (!rfqTrade.trade ? t('Unable request a quote') : undefined)}
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
    resetConfirmModalState()

    if (isExpertMode) {
      startSwap()
    }
    onPresentConfirmModal()
    logGTMClickSwapEvent()
  }, [rfqTrade.trade, resetConfirmModalState, isExpertMode, onPresentConfirmModal, startSwap])

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
      <CommitButton
        width="100%"
        disabled={Boolean(wrapInputError)}
        onClick={onWrap}
        data-dd-action-name="Swap wrap button"
      >
        {wrapInputError ?? (wrapType === WrapType.WRAP ? t('Wrap') : wrapType === WrapType.UNWRAP ? t('Unwrap') : null)}
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
      data-dd-action-name="Swap mm commit button"
    >
      {parseMMError(swapInputError) || t('Swap')}
    </CommitButton>
  )
}
