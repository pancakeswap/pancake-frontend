import { useTranslation } from '@pancakeswap/localization'
import { TradeType } from '@pancakeswap/sdk'
import { SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { Currency, CurrencyAmount, Fraction, ONE, Percent } from '@pancakeswap/swap-sdk-core'
import { AutoColumn, Box, Button, Dots, Message, MessageText, Text, useModal } from '@pancakeswap/uikit'
import { getUniversalRouterAddress } from '@pancakeswap/universal-router-sdk'
import { useExpertMode } from '@pancakeswap/utils/user'
import { confirmPriceImpactWithoutFee } from '@pancakeswap/widgets-internal'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { logGTMClickSwapEvent } from 'utils/customGTMEventTracking'

import { getPermit2Address } from '@pancakeswap/permit2-sdk'
import { GreyCard } from 'components/Card'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { AutoRow } from 'components/Layout/Row'
import SettingsModal, { RoutingSettingsButton, withCustomOnDismiss } from 'components/Menu/GlobalSettings/SettingsModal'
import { SettingsMode } from 'components/Menu/GlobalSettings/types'
import {
  ALLOWED_PRICE_IMPACT_HIGH,
  BIG_INT_ZERO,
  PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN,
} from 'config/constants/exchange'
import { useCurrency } from 'hooks/Tokens'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import usePermit2Allowance, { AllowanceState } from 'hooks/usePermit2Allowance'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { useRoutingSettingChanged } from 'state/user/smartRouter'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { warningSeverity } from 'utils/exchange'
import { isChainSupported } from 'utils/wagmi'
import { useAccount, useChainId } from 'wagmi'
import { useParsedAmounts, useSlippageAdjustedAmounts, useSwapCallback, useSwapInputError } from '../hooks'
import { useConfirmModalState } from '../hooks/useConfirmModalState'
import { TransactionRejectedError } from '../hooks/useSendSwapTransaction'
import { useWallchainApi } from '../hooks/useWallchain'
import { computeTradePriceBreakdown } from '../utils/exchange'
import { ConfirmSwapModal } from './ConfirmSwapModal'

const SettingsModalWithCustomDismiss = withCustomOnDismiss(SettingsModal)

interface SwapCommitButtonPropsType {
  trade?: SmartRouterTrade<TradeType>
  tradeError?: Error
  tradeLoading?: boolean
}

export function useMaxAmountIn(trade: SmartRouterTrade<TradeType>, slippage: Percent, amountIn = trade?.inputAmount) {
  if (!trade) return undefined
  if (trade?.tradeType === TradeType.EXACT_INPUT) {
    return amountIn
  }

  const slippageAdjustedAmountIn = new Fraction(ONE).add(slippage).multiply(amountIn.quotient).quotient
  return CurrencyAmount.fromRawAmount(amountIn.currency, slippageAdjustedAmountIn)
}

export const SwapCommitButton = memo(function SwapCommitButton({
  trade,
  tradeError,
  tradeLoading,
}: SwapCommitButtonPropsType) {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const chainId = useChainId()
  const [isExpertMode] = useExpertMode()
  const {
    typedValue,
    independentField,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId) as Currency
  const outputCurrency = useCurrency(outputCurrencyId) as Currency
  const swapIsUnsupported = useIsTransactionUnsupported(inputCurrency, outputCurrency)
  const { onUserInput } = useSwapActionHandlers()
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(inputCurrency, outputCurrency, typedValue)
  const showWrap = wrapType !== WrapType.NOT_APPLICABLE
  const [isRoutingSettingChange, resetRoutingSetting] = useRoutingSettingChanged()
  const slippageAdjustedAmounts = useSlippageAdjustedAmounts(trade)
  const deadline = useTransactionDeadline()
  const [statusWallchain, approvalAddressForWallchain, wallchainMasterInput] = useWallchainApi(trade, deadline)
  const [wallchainSecondaryStatus, setWallchainSecondaryStatus] = useState<'found' | 'not-found'>('not-found')

  const routerAddress =
    statusWallchain === 'found' || wallchainSecondaryStatus === 'found'
      ? approvalAddressForWallchain
      : getPermit2Address(chainId)

  const amountToApprove = slippageAdjustedAmounts[Field.INPUT]
  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ])
  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  }

  // check whether the user has approved the router on the input token
  const { approvalState, currentAllowance, isPendingError } = useApproveCallback(amountToApprove, routerAddress)

  const allowance = usePermit2Allowance(
    routerAddress,
    amountToApprove as any,
    isChainSupported(chainId) ? getUniversalRouterAddress(chainId) : undefined,
  )
  // @ts-ignore
  const tradePriceBreakdown = useMemo(() => !showWrap && computeTradePriceBreakdown(trade), [showWrap, trade])
  const swapInputError = useSwapInputError(trade, currencyBalances)
  const parsedAmounts = useParsedAmounts(trade, currencyBalances, showWrap)
  const parsedIndepentFieldAmount = parsedAmounts[independentField]

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  const onWallchainDrop = useCallback(() => {
    setApprovalSubmitted(false)
  }, [setApprovalSubmitted])

  const {
    callback: swapCallback,
    error: swapCallbackError,
    reason: revertReason,
  } = useSwapCallback({
    trade,
    deadline,
    permitSignature: allowance.state === AllowanceState.ALLOWED ? allowance.permitSignature : undefined,
    onWallchainDrop,
    wallchainMasterInput,
    statusWallchain,
  })

  const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    tradeToConfirm: SmartRouterTrade<TradeType> | undefined
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
  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash, setSwapState])

  const handleSwap = useCallback(async () => {
    if (
      tradePriceBreakdown &&
      !confirmPriceImpactWithoutFee(
        tradePriceBreakdown.priceImpactWithoutFee as Percent,
        PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN,
        ALLOWED_PRICE_IMPACT_HIGH,
        t,
      )
    ) {
      return undefined
    }
    if (!swapCallback) {
      if (revertReason === 'insufficient allowance') {
        setApprovalSubmitted(false)
        setWallchainSecondaryStatus('found')
        return undefined
      }
      return undefined
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })
    return swapCallback()
      .then((res) => {
        setWallchainSecondaryStatus('not-found')
        setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: res.hash })
      })
      .catch((error) => {
        console.error('swapCallback error#1001', error, JSON.stringify(error))
        setWallchainSecondaryStatus('not-found')

        if (error instanceof TransactionRejectedError) {
          setSwapState((s) => ({
            ...s,
            txHash: undefined,
            attemptingTxn: false,
          }))
          // throw reject error to reset the flow
          throw error
        }

        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage:
            (typeof error === 'string' ? error : error?.message) ??
            t('Swap failed: %message%', { message: 'unknown reason #1001' }),
          txHash: undefined,
        })
      })
  }, [tradePriceBreakdown, swapCallback, tradeToConfirm, t, setSwapState, revertReason])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn })
  }, [attemptingTxn, swapErrorMessage, trade, txHash, setSwapState])
  // End Handlers

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(
    tradePriceBreakdown ? (tradePriceBreakdown.priceImpactWithoutFee as Percent) : undefined,
  )

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.PENDING ||
      allowance.state === AllowanceState.REQUIRED ||
      allowance.state === AllowanceState.LOADING) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  // Modals
  const [indirectlyOpenConfirmModalState, setIndirectlyOpenConfirmModalState] = useState(false)

  const {
    confirmModalState,
    pendingModalSteps,
    startSwapFlow,
    onCancel: resetSwapFlow,
  } = useConfirmModalState({
    txHash,
    chainId,
    approval: approvalState,
    approvalToken: trade?.inputAmount?.currency,
    currentAllowance,
    isExpertMode,
    onConfirm: handleSwap,
    allowance,
  })

  const [onPresentSettingsModal] = useModal(
    <SettingsModalWithCustomDismiss
      customOnDismiss={() => setIndirectlyOpenConfirmModalState(true)}
      mode={SettingsMode.SWAP_LIQUIDITY}
    />,
  )

  const [onPresentConfirmModal] = useModal(
    <ConfirmSwapModal
      trade={trade}
      txHash={txHash}
      approval={approvalState}
      allowance={allowance}
      attemptingTxn={attemptingTxn}
      originalTrade={tradeToConfirm}
      showApproveFlow={showApproveFlow}
      currencyBalances={currencyBalances}
      swapErrorMessage={swapErrorMessage}
      confirmModalState={confirmModalState}
      pendingModalSteps={pendingModalSteps}
      isPendingError={isPendingError}
      startSwapFlow={startSwapFlow}
      onAcceptChanges={handleAcceptChanges}
      customOnDismiss={handleConfirmDismiss}
      openSettingModal={onPresentSettingsModal}
    />,
    true,
    true,
    'confirmSwapModal',
  )
  // End Modals

  const onSwapHandler = useCallback(() => {
    setSwapState({
      tradeToConfirm: trade,
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
  }, [trade, onPresentConfirmModal, isExpertMode, startSwapFlow, resetSwapFlow])

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

  // Reset approval flow if input currency changed
  useEffect(() => {
    setApprovalSubmitted(false)
  }, [trade?.inputAmount?.currency])

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approvalState, approvalSubmitted])

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

  const noRoute = !((trade?.routes?.length ?? 0) > 0) || tradeError

  const userHasSpecifiedInputOutput = Boolean(
    inputCurrency && outputCurrency && parsedIndepentFieldAmount?.greaterThan(BIG_INT_ZERO),
  )

  if (noRoute && userHasSpecifiedInputOutput && !tradeLoading) {
    return (
      <AutoColumn gap="12px">
        <GreyCard style={{ textAlign: 'center', padding: '0.75rem' }}>
          <Text color="textSubtle">{t('Insufficient liquidity for this trade.')}</Text>
        </GreyCard>
        {isRoutingSettingChange && (
          <Message variant="warning" icon={<></>}>
            <AutoColumn gap="8px">
              <MessageText>{t('Unable to establish trading route due to customized routing.')}</MessageText>
              <AutoRow gap="4px">
                <RoutingSettingsButton
                  buttonProps={{
                    scale: 'xs',
                    p: 0,
                  }}
                  showRedDot={false}
                >
                  {t('Check your settings')}
                </RoutingSettingsButton>
                <MessageText>{t('or')}</MessageText>
                <Button
                  variant="text"
                  scale="xs"
                  p="0"
                  onClick={resetRoutingSetting}
                  data-dd-action-name="Swap reset routing settings button"
                >
                  {t('Reset to default')}
                </Button>
              </AutoRow>
            </AutoColumn>
          </Message>
        )}
      </AutoColumn>
    )
  }

  const isValid = !swapInputError && !tradeLoading

  return (
    <Box mt="0.25rem">
      <CommitButton
        id="swap-button"
        width="100%"
        variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'primary'}
        disabled={
          !isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError || statusWallchain === 'pending'
        }
        onClick={onSwapHandler}
        data-dd-action-name="Swap commit button"
      >
        {swapInputError ||
          (tradeLoading && <Dots>{t('Searching For The Best Price')}</Dots>) ||
          (priceImpactSeverity > 3 && !isExpertMode
            ? t('Price Impact Too High')
            : priceImpactSeverity > 2
            ? t('Swap Anyway')
            : t('Swap'))}
      </CommitButton>
    </Box>
  )
})
