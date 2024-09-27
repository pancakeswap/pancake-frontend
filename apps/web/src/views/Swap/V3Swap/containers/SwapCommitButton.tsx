import { Currency } from '@pancakeswap/swap-sdk-core'
import { AutoColumn, Box, Button, Dots, Message, MessageText, Text, useModal } from '@pancakeswap/uikit'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'

import { useTranslation } from '@pancakeswap/localization'
import { PriceOrder } from '@pancakeswap/price-api-sdk'
import { getUniversalRouterAddress } from '@pancakeswap/universal-router-sdk'
import { ConfirmModalState } from '@pancakeswap/widgets-internal'
import { GreyCard } from 'components/Card'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { AutoRow } from 'components/Layout/Row'
import SettingsModal, { RoutingSettingsButton, withCustomOnDismiss } from 'components/Menu/GlobalSettings/SettingsModal'
import { SettingsMode } from 'components/Menu/GlobalSettings/types'
import { BIG_INT_ZERO } from 'config/constants/exchange'
import { useCurrency } from 'hooks/Tokens'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { useRoutingSettingChanged } from 'state/user/smartRouter'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { logGTMClickSwapConfirmEvent, logGTMClickSwapEvent } from 'utils/customGTMEventTracking'
import { warningSeverity } from 'utils/exchange'
import { isClassicOrder, isXOrder } from 'views/Swap/utils'
import { useAccount, useChainId } from 'wagmi'
import { useParsedAmounts, useSlippageAdjustedAmounts, useSwapInputError } from '../hooks'
import { useConfirmModalState } from '../hooks/useConfirmModalState'
import { useSwapConfig } from '../hooks/useSwapConfig'
import { useSwapCurrency } from '../hooks/useSwapCurrency'
import { CommitButtonProps } from '../types'
import { computeTradePriceBreakdown } from '../utils/exchange'
import { ConfirmSwapModal } from './ConfirmSwapModal'

const SettingsModalWithCustomDismiss = withCustomOnDismiss(SettingsModal)

interface SwapCommitButtonPropsType {
  order?: PriceOrder
  tradeError?: Error | null
  tradeLoading?: boolean
}

const useSettingModal = (onDismiss) => {
  const [openSettingsModal] = useModal(
    <SettingsModalWithCustomDismiss customOnDismiss={onDismiss} mode={SettingsMode.SWAP_LIQUIDITY} />,
  )
  return openSettingsModal
}

const useSwapCurrencies = () => {
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId) as Currency
  const outputCurrency = useCurrency(outputCurrencyId) as Currency
  return { inputCurrency, outputCurrency }
}

const WrapCommitButtonReplace: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation()
  const { inputCurrency, outputCurrency } = useSwapCurrencies()
  const { typedValue } = useSwapState()
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(inputCurrency, outputCurrency, typedValue)
  const showWrap = wrapType !== WrapType.NOT_APPLICABLE

  if (!showWrap) return children

  return (
    <CommitButton width="100%" disabled={Boolean(wrapInputError)} onClick={onWrap}>
      {wrapInputError ?? (wrapType === WrapType.WRAP ? t('Wrap') : wrapType === WrapType.UNWRAP ? t('Unwrap') : null)}
    </CommitButton>
  )
}

const ConnectButtonReplace = ({ children }) => {
  const { address: account } = useAccount()

  if (!account) {
    return <ConnectWalletButton width="100%" />
  }
  return children
}

const UnsupportedSwapButtonReplace = ({ children }) => {
  const { t } = useTranslation()
  const { inputCurrency, outputCurrency } = useSwapCurrencies()
  const swapIsUnsupported = useIsTransactionUnsupported(inputCurrency, outputCurrency)

  if (swapIsUnsupported) {
    return (
      <Button width="100%" disabled>
        {t('Unsupported Asset')}
      </Button>
    )
  }
  return children
}

const SwapCommitButtonComp: React.FC<SwapCommitButtonPropsType & CommitButtonProps> = (props) => {
  return (
    <UnsupportedSwapButtonReplace>
      <ConnectButtonReplace>
        <WrapCommitButtonReplace>
          <SwapCommitButtonInner {...props} />
        </WrapCommitButtonReplace>
      </ConnectButtonReplace>
    </UnsupportedSwapButtonReplace>
  )
}

export const SwapCommitButton = memo(SwapCommitButtonComp)

const SwapCommitButtonInner = memo(function SwapCommitButtonInner({
  order,
  tradeError,
  tradeLoading,
  beforeCommit,
  afterCommit,
}: SwapCommitButtonPropsType & CommitButtonProps) {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const chainId = useChainId()
  // form data
  const { independentField } = useSwapState()
  const [inputCurrency, outputCurrency] = useSwapCurrency()
  const { isExpertMode } = useSwapConfig()

  const tradePriceBreakdown = useMemo(
    () => computeTradePriceBreakdown(isXOrder(order) ? undefined : order?.trade),
    [order],
  )

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(
    tradePriceBreakdown ? tradePriceBreakdown.priceImpactWithoutFee : undefined,
  )

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ])
  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  }
  const parsedAmounts = useParsedAmounts(order?.trade, currencyBalances, false)
  const parsedIndependentFieldAmount = parsedAmounts[independentField]
  const swapInputError = useSwapInputError(order, currencyBalances)
  const [tradeToConfirm, setTradeToConfirm] = useState<PriceOrder | undefined>(undefined)
  const [indirectlyOpenConfirmModalState, setIndirectlyOpenConfirmModalState] = useState(false)

  // FIXME: using order as fallback here simply to avoid empty permit2 detail
  // Need to fetch permit2 information on the fly instead
  const orderToExecute = useMemo(
    () => (isExpertMode ? order : tradeToConfirm?.trade ? tradeToConfirm : order),
    [isExpertMode, order, tradeToConfirm],
  )
  const slippageAdjustedAmounts = useSlippageAdjustedAmounts(orderToExecute)
  const amountToApprove = useMemo(
    () =>
      inputCurrency?.isNative
        ? isXOrder(orderToExecute)
          ? slippageAdjustedAmounts[Field.INPUT]
          : undefined
        : slippageAdjustedAmounts[Field.INPUT],
    [inputCurrency?.isNative, orderToExecute, slippageAdjustedAmounts],
  )

  const { callToAction, confirmState, txHash, orderHash, confirmActions, errorMessage, resetState } =
    useConfirmModalState(orderToExecute, amountToApprove?.wrapped, getUniversalRouterAddress(chainId))

  const { onUserInput } = useSwapActionHandlers()
  const reset = useCallback(() => {
    afterCommit?.()
    setTradeToConfirm(undefined)
    if (confirmState === ConfirmModalState.COMPLETED) {
      onUserInput(Field.INPUT, '')
    }
    resetState()
  }, [afterCommit, confirmState, onUserInput, resetState])

  const handleAcceptChanges = useCallback(() => {
    setTradeToConfirm(order)
  }, [order])

  const noRoute = useMemo(
    () => (isClassicOrder(order) && !((order.trade?.routes?.length ?? 0) > 0)) || tradeError,
    [order, tradeError],
  )
  const isValid = useMemo(() => !swapInputError && !tradeLoading, [swapInputError, tradeLoading])
  const disabled = useMemo(
    () => !isValid || (priceImpactSeverity > 3 && !isExpertMode),
    [isExpertMode, isValid, priceImpactSeverity],
  )

  const userHasSpecifiedInputOutput = Boolean(
    inputCurrency && outputCurrency && parsedIndependentFieldAmount?.greaterThan(BIG_INT_ZERO),
  )

  const onConfirm = useCallback(() => {
    beforeCommit?.()
    logGTMClickSwapConfirmEvent()
    callToAction()
  }, [beforeCommit, callToAction])

  // modals
  const onSettingModalDismiss = useCallback(() => {
    setIndirectlyOpenConfirmModalState(true)
  }, [])
  const openSettingModal = useSettingModal(onSettingModalDismiss)
  const [openConfirmSwapModal] = useModal(
    <ConfirmSwapModal
      order={order}
      orderHash={orderHash}
      originalOrder={tradeToConfirm}
      txHash={txHash}
      confirmModalState={confirmState}
      pendingModalSteps={confirmActions ?? []}
      swapErrorMessage={errorMessage}
      currencyBalances={currencyBalances}
      onAcceptChanges={handleAcceptChanges}
      onConfirm={onConfirm}
      openSettingModal={openSettingModal}
      customOnDismiss={reset}
    />,
    true,
    true,
    'confirmSwapModal',
  )

  const handleSwap = useCallback(() => {
    setTradeToConfirm(order)
    resetState()

    // if expert mode turn-on, will not show preview modal
    // start swap directly
    if (isExpertMode) {
      onConfirm()
    }

    openConfirmSwapModal()
    logGTMClickSwapEvent()
  }, [isExpertMode, onConfirm, openConfirmSwapModal, resetState, order])

  useEffect(() => {
    if (indirectlyOpenConfirmModalState) {
      setIndirectlyOpenConfirmModalState(false)
      openConfirmSwapModal()
    }
  }, [indirectlyOpenConfirmModalState, openConfirmSwapModal])

  if (noRoute && userHasSpecifiedInputOutput && !tradeLoading) {
    return <ResetRoutesButton />
  }

  return (
    <Box mt="0.25rem">
      <CommitButton
        id="swap-button"
        width="100%"
        data-dd-action-name="Swap commit button"
        variant={isValid && priceImpactSeverity > 2 && !errorMessage ? 'danger' : 'primary'}
        disabled={disabled}
        onClick={handleSwap}
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

const ResetRoutesButton = () => {
  const { t } = useTranslation()
  const [isRoutingSettingChange, resetRoutingSetting] = useRoutingSettingChanged()
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
