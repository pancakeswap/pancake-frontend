import { useTranslation } from '@pancakeswap/localization'
import { TradeType } from '@pancakeswap/sdk'
import {
  Button,
  Text,
  useModal,
  confirmPriceImpactWithoutFee,
  Column,
  Box,
  Message,
  MessageText,
  AutoColumn,
  Dots,
} from '@pancakeswap/uikit'
import { useCallback, useEffect, useState, useMemo, memo } from 'react'
import { SMART_ROUTER_ADDRESSES, SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { logGTMClickSwapEvent } from 'utils/customGTMEventTracking'

import { useIsTransactionUnsupported } from 'hooks/Trades'
import { GreyCard } from 'components/Card'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { AutoRow, RowBetween } from 'components/Layout/Row'
import CircleLoader from 'components/Loader/CircleLoader'
import SettingsModal, { RoutingSettingsButton, withCustomOnDismiss } from 'components/Menu/GlobalSettings/SettingsModal'
import { SettingsMode } from 'components/Menu/GlobalSettings/types'
import {
  BIG_INT_ZERO,
  PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN,
  ALLOWED_PRICE_IMPACT_HIGH,
} from 'config/constants/exchange'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { Field } from 'state/swap/actions'
import { useExpertMode } from '@pancakeswap/utils/user'
import { warningSeverity } from 'utils/exchange'
import { useSwapState } from 'state/swap/hooks'
import { useCurrency } from 'hooks/Tokens'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { useRoutingSettingChanged } from 'state/user/smartRouter'

import { useAccount } from 'wagmi'
import ProgressSteps from '../../components/ProgressSteps'
import { SwapCallbackError } from '../../components/styleds'
import { useSlippageAdjustedAmounts, useSwapInputError, useParsedAmounts, useSwapCallback } from '../hooks'
import { TransactionRejectedError } from '../hooks/useSendSwapTransaction'
import { computeTradePriceBreakdown } from '../utils/exchange'
import { ConfirmSwapModal } from './ConfirmSwapModal'

const SettingsModalWithCustomDismiss = withCustomOnDismiss(SettingsModal)

interface SwapCommitButtonPropsType {
  trade?: SmartRouterTrade<TradeType>
  tradeError?: Error
  tradeLoading?: boolean
}

export const SwapCommitButton = memo(function SwapCommitButton({
  trade,
  tradeError,
  tradeLoading,
}: SwapCommitButtonPropsType) {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const [isExpertMode] = useExpertMode()
  const {
    typedValue,
    independentField,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
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
  const routerAddress = SMART_ROUTER_ADDRESSES[trade?.inputAmount?.currency?.chainId]
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
  const [approval, approveCallback] = useApproveCallback(amountToApprove, routerAddress)
  const { priceImpactWithoutFee } = useMemo(() => !showWrap && computeTradePriceBreakdown(trade), [showWrap, trade])
  const swapInputError = useSwapInputError(trade, currencyBalances)
  const parsedAmounts = useParsedAmounts(trade, currencyBalances, showWrap)
  const parsedIndepentFieldAmount = parsedAmounts[independentField]

  // the callback to execute the swap
  const deadline = useTransactionDeadline()
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback({ trade, deadline })

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

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // Handlers
  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash, setSwapState])

  const handleSwap = useCallback(() => {
    if (
      priceImpactWithoutFee &&
      !confirmPriceImpactWithoutFee(
        priceImpactWithoutFee,
        PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN,
        ALLOWED_PRICE_IMPACT_HIGH,
        t,
      )
    ) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then((res) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: res.hash })
      })
      .catch((error) => {
        if (error instanceof TransactionRejectedError) {
          handleConfirmDismiss()
          return
        }
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: typeof error === 'string' ? error : error.message,
          txHash: undefined,
        })
      })
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm, t, setSwapState, handleConfirmDismiss])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn })
  }, [attemptingTxn, swapErrorMessage, trade, txHash, setSwapState])
  // End Handlers

  // Modals
  const [indirectlyOpenConfirmModalState, setIndirectlyOpenConfirmModalState] = useState(false)

  const [onPresentSettingsModal] = useModal(
    <SettingsModalWithCustomDismiss
      customOnDismiss={() => setIndirectlyOpenConfirmModalState(true)}
      mode={SettingsMode.SWAP_LIQUIDITY}
    />,
  )

  const [onPresentConfirmModal] = useModal(
    <ConfirmSwapModal
      trade={trade}
      originalTrade={tradeToConfirm}
      currencyBalances={currencyBalances}
      onAcceptChanges={handleAcceptChanges}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      onConfirm={handleSwap}
      swapErrorMessage={swapErrorMessage}
      customOnDismiss={handleConfirmDismiss}
      openSettingModal={onPresentSettingsModal}
    />,
    true,
    true,
    'confirmSwapModal',
  )
  // End Modals

  const onSwapHandler = useCallback(() => {
    if (isExpertMode) {
      handleSwap()
    } else {
      setSwapState({
        tradeToConfirm: trade,
        attemptingTxn: false,
        swapErrorMessage: undefined,
        txHash: undefined,
      })
      onPresentConfirmModal()
    }
    logGTMClickSwapEvent()
  }, [isExpertMode, handleSwap, onPresentConfirmModal, trade])

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
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

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

  const noRoute = !(trade?.routes?.length > 0) || tradeError

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
                <Button variant="text" scale="xs" p="0" onClick={resetRoutingSetting}>
                  {t('Reset to default')}
                </Button>
              </AutoRow>
            </AutoColumn>
          </Message>
        )}
      </AutoColumn>
    )
  }

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const isValid = !swapInputError && !tradeLoading
  const approved = approval === ApprovalState.APPROVED
  const content = showApproveFlow ? (
    <>
      <RowBetween>
        <CommitButton
          variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
          onClick={approveCallback}
          disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
          width="48%"
        >
          {approval === ApprovalState.PENDING ? (
            <AutoRow gap="6px" justify="center">
              {t('Enabling')} <CircleLoader stroke="white" />
            </AutoRow>
          ) : approvalSubmitted && approved ? (
            t('Enabled')
          ) : (
            t('Enable %asset%', { asset: inputCurrency?.symbol ?? '' })
          )}
        </CommitButton>
        <CommitButton
          variant={isValid && priceImpactSeverity > 2 ? 'danger' : 'primary'}
          onClick={() => {
            onSwapHandler()
          }}
          width="48%"
          id="swap-button"
          disabled={!isValid || !approved || (priceImpactSeverity > 3 && !isExpertMode)}
        >
          {(tradeLoading && (
            <>
              <Dots>{t('Searching For The Best Price')}</Dots>
            </>
          )) ||
            (priceImpactSeverity > 3 && !isExpertMode
              ? t('Price Impact High')
              : priceImpactSeverity > 2
              ? t('Swap Anyway')
              : t('Swap'))}
        </CommitButton>
      </RowBetween>
      <Column style={{ marginTop: '1rem' }}>
        <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
      </Column>
      {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
    </>
  ) : (
    <>
      <CommitButton
        variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'primary'}
        onClick={() => {
          onSwapHandler()
        }}
        id="swap-button"
        width="100%"
        disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError || !approved}
      >
        {swapInputError ||
          (tradeLoading && (
            <>
              <Dots>{t('Searching For The Best Price')}</Dots>
            </>
          )) ||
          (priceImpactSeverity > 3 && !isExpertMode
            ? t('Price Impact Too High')
            : priceImpactSeverity > 2
            ? t('Swap Anyway')
            : t('Swap'))}
      </CommitButton>

      {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
    </>
  )

  return <Box mt="0.25rem">{content}</Box>
})
