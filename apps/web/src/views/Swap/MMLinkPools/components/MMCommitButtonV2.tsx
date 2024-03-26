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
import { ConfirmSwapModalV2 } from 'views/Swap/V3Swap/containers/ConfirmSwapModalV2'
import { CommitButtonProps } from 'views/Swap/V3Swap/types'
import { MMTradeInfo } from '../hooks'
import { useMMConfirmModalState } from '../hooks/useMMConfirmModalState'
import { useSwapCallArguments } from '../hooks/useSwapCallArguments'
import { MMRfqTrade } from '../types'

const SettingsModalWithCustomDismiss = withCustomOnDismiss(SettingsModal)

type Trade = SmartRouterTrade<TradeType> | V4Router.V4Trade<TradeType>

interface SwapCommitButtonPropsType {
  mmTradeInfo: MMTradeInfo<Trade> | null
  swapIsUnsupported: boolean
  account: Address | undefined
  showWrap: boolean
  wrapInputError?: string
  onWrap?: () => Promise<void>
  wrapType: WrapType
  currencies: {
    INPUT?: Currency
    OUTPUT?: Currency
  }
  isExpertMode: boolean
  rfqTrade: MMRfqTrade<Trade> | null
  swapInputError?: string
  currencyBalances?: {
    INPUT?: CurrencyAmount<Currency>
    OUTPUT?: CurrencyAmount<Currency>
  }
  recipient: string | null
  onUserInput: (field: Field, typedValue: string) => void
  mmQuoteExpiryRemainingSec?: number | null
}

export function MMSwapCommitButtonV2({
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
  beforeCommit,
  afterCommit,
}: // isPendingError,
SwapCommitButtonPropsType & CommitButtonProps) {
  const [isExpertMode] = useExpertMode()

  const { t } = useTranslation()
  const [tradeToConfirm, setTradeToConfirm] = useState<Trade | undefined>(undefined)
  const amountToApprove = useMemo(() => {
    return mmTradeInfo?.slippageAdjustedAmounts[Field.INPUT]
  }, [mmTradeInfo])
  const mmSpender = useMemo(() => {
    return mmTradeInfo?.routerAddress as Address | undefined
  }, [mmTradeInfo])
  const swapCalls = useSwapCallArguments(rfqTrade?.trade, rfqTrade?.rfq ?? undefined, recipient ?? undefined)
  const { resetState, txHash, confirmState, confirmActions, callToAction, errorMessage } = useMMConfirmModalState(
    (isExpertMode ? rfqTrade?.trade : tradeToConfirm) ?? undefined,
    swapCalls,
    (recipient as Address) ?? null,
    amountToApprove?.currency.isToken ? (amountToApprove as CurrencyAmount<Token>) : undefined,
    mmSpender,
    rfqTrade?.quoteExpiry ?? undefined,
  )

  // Handlers

  const handleAcceptChanges = useCallback(() => {
    setTradeToConfirm(rfqTrade?.trade ?? undefined)
    resetState()
  }, [rfqTrade?.trade, resetState])

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
    <ConfirmSwapModalV2
      isMM
      trade={rfqTrade?.trade ?? undefined} // show the info while refresh RFQ
      originalTrade={tradeToConfirm}
      txHash={txHash}
      confirmModalState={confirmState}
      pendingModalSteps={confirmActions ?? []}
      onConfirm={onConfirm}
      currencyBalances={currencyBalances}
      isRFQReady={Boolean(rfqTrade?.rfq) && !rfqTrade?.isLoading}
      swapErrorMessage={errorMessage || (!rfqTrade?.trade ? t('Unable request a quote') : undefined)}
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
    setTradeToConfirm(rfqTrade?.trade ?? undefined)
    resetState()

    if (isExpertMode) {
      onConfirm()
    }
    onPresentConfirmModal()
    logGTMClickSwapEvent()
  }, [rfqTrade?.trade, resetState, isExpertMode, onPresentConfirmModal, onConfirm])

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
      disabled={!rfqTrade?.rfq || !isValid || !!errorMessage}
      onClick={onSwapHandler}
      data-dd-action-name="Swap mm commit button"
    >
      {parseMMError(swapInputError) || t('Swap')}
    </CommitButton>
  )
}
