import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Token, TradeType } from '@pancakeswap/sdk'
import { SmartRouterTrade, V4Router } from '@pancakeswap/smart-router'
import { Button, useModal } from '@pancakeswap/uikit'
import { useExpertMode } from '@pancakeswap/utils/user'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import SettingsModal, { withCustomOnDismiss } from 'components/Menu/GlobalSettings/SettingsModal'
import { SettingsMode } from 'components/Menu/GlobalSettings/types'
import { WrapType } from 'hooks/useWrapCallback'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Field } from 'state/swap/actions'
import { logGTMClickSwapEvent } from 'utils/customGTMEventTracking'
import { Address } from 'viem'
import { parseMMError } from 'views/Swap/MMLinkPools/utils/exchange'
import { ConfirmSwapModal } from 'views/Swap/V3Swap/containers/ConfirmSwapModal'
import { CommitButtonProps } from 'views/Swap/V3Swap/types'
import { MMOrder } from 'views/Swap/utils'
import { useMMConfirmModalState } from '../hooks/useMMConfirmModalState'
import { useSwapCallArguments } from '../hooks/useSwapCallArguments'

const SettingsModalWithCustomDismiss = withCustomOnDismiss(SettingsModal)

type Trade = SmartRouterTrade<TradeType> | V4Router.V4Trade<TradeType>

interface SwapCommitButtonPropsType {
  order: MMOrder
  swapIsUnsupported: boolean
  account: Address | undefined
  showWrap: boolean
  wrapInputError?: string
  onWrap?: () => Promise<unknown>
  wrapType: WrapType
  currencies: {
    INPUT?: Currency
    OUTPUT?: Currency
  }
  isExpertMode: boolean
  swapInputError?: string
  currencyBalances?: {
    INPUT?: CurrencyAmount<Currency>
    OUTPUT?: CurrencyAmount<Currency>
  }
  recipient: string | null
  onUserInput: (field: Field, typedValue: string) => void
}

export function MMSwapCommitButton({
  order,
  swapIsUnsupported,
  account,
  showWrap,
  wrapInputError,
  onWrap,
  wrapType,
  swapInputError,
  currencyBalances,
  recipient,
  onUserInput,
  beforeCommit,
  afterCommit,
}: // isPendingError,
SwapCommitButtonPropsType & CommitButtonProps) {
  const [isExpertMode] = useExpertMode()

  const { t } = useTranslation()
  const [tradeToConfirm, setTradeToConfirm] = useState<MMOrder | undefined>(undefined)
  const amountToApprove = useMemo(() => {
    return order?.mmTradeInfo?.slippageAdjustedAmounts[Field.INPUT]
  }, [order?.mmTradeInfo])
  const mmSpender = useMemo(() => {
    return order?.mmTradeInfo?.routerAddress as Address | undefined
  }, [order?.mmTradeInfo])
  const swapCalls = useSwapCallArguments(
    order?.mmRFQTrade?.trade,
    order?.mmRFQTrade?.rfq ?? undefined,
    recipient ?? undefined,
  )
  const { resetState, txHash, confirmState, confirmActions, callToAction, errorMessage } = useMMConfirmModalState(
    (isExpertMode ? order?.mmRFQTrade?.trade : tradeToConfirm?.mmRFQTrade?.trade) ?? undefined,
    swapCalls,
    (recipient as Address) ?? null,
    amountToApprove?.currency.isToken ? (amountToApprove as CurrencyAmount<Token>) : undefined,
    mmSpender,
    order?.mmRFQTrade?.quoteExpiry ?? undefined,
  )

  // Handlers

  const handleAcceptChanges = useCallback(() => {
    setTradeToConfirm(order ?? undefined)
    resetState()
  }, [order, resetState])

  const handleConfirmDismiss = useCallback(() => {
    afterCommit?.()
    resetState()
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [afterCommit, resetState, txHash, onUserInput])

  // Modals
  const [indirectlyOpenConfirmModalState, setIndirectlyOpenConfirmModalState] = useState(false)

  const [onPresentSettingsModal] = useModal(
    <SettingsModalWithCustomDismiss
      customOnDismiss={() => setIndirectlyOpenConfirmModalState(true)}
      mode={SettingsMode.SWAP_LIQUIDITY}
    />,
  )

  const onConfirm = useCallback(() => {
    beforeCommit?.()

    callToAction()
  }, [beforeCommit, callToAction])

  const [onPresentConfirmModal] = useModal(
    <ConfirmSwapModal
      order={order}
      originalOrder={tradeToConfirm} // show the info while refresh RFQ
      txHash={txHash}
      confirmModalState={confirmState}
      pendingModalSteps={confirmActions ?? []}
      onConfirm={onConfirm}
      currencyBalances={currencyBalances}
      isRFQReady={Boolean(order?.mmRFQTrade?.rfq) && !order?.mmRFQTrade?.isLoading}
      swapErrorMessage={errorMessage || (!order?.mmRFQTrade?.trade ? t('Unable request a quote') : undefined)}
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
    setTradeToConfirm(order ?? undefined)
    resetState()

    if (isExpertMode) {
      onConfirm()
    }
    onPresentConfirmModal()
    logGTMClickSwapEvent()
  }, [order, resetState, isExpertMode, onPresentConfirmModal, onConfirm])

  // useEffect
  useEffect(() => {
    if (indirectlyOpenConfirmModalState) {
      setIndirectlyOpenConfirmModalState(false)
      resetState()
      onPresentConfirmModal()
    }
  }, [indirectlyOpenConfirmModalState, onPresentConfirmModal, resetState])

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
      disabled={!order.mmRFQTrade?.rfq || !isValid || !!errorMessage}
      onClick={onSwapHandler}
      data-dd-action-name="Swap mm commit button"
    >
      {parseMMError(swapInputError) || t('Swap')}
    </CommitButton>
  )
}
