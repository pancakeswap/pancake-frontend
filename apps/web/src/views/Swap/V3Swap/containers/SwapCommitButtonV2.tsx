import { TradeType } from '@pancakeswap/sdk'
import { SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { Currency } from '@pancakeswap/swap-sdk-core'
import { AutoColumn, Box, Button, Dots, Message, MessageText, Text, useModal } from '@pancakeswap/uikit'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'

import { useTranslation } from '@pancakeswap/localization'
import { Permit2Signature, getUniversalRouterAddress } from '@pancakeswap/universal-router-sdk'
import { GreyCard } from 'components/Card'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { AutoRow } from 'components/Layout/Row'
import SettingsModal, { RoutingSettingsButton, withCustomOnDismiss } from 'components/Menu/GlobalSettings/SettingsModal'
import { SettingsMode } from 'components/Menu/GlobalSettings/types'
import { BIG_INT_ZERO } from 'config/constants/exchange'
import { useCurrency } from 'hooks/Tokens'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import { usePermit } from 'hooks/usePermitStatus'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { useRoutingSettingChanged } from 'state/user/smartRouter'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { logGTMClickSwapEvent } from 'utils/customGTMEventTracking'
import { warningSeverity } from 'utils/exchange'
import { isUserRejected } from 'utils/sentry'
import { useAccount, useChainId } from 'wagmi'
import { useParsedAmounts, useSlippageAdjustedAmounts, useSwapInputError } from '../hooks'
import { useConfirmModalStateV2 } from '../hooks/useConfirmModalStateV2'
import { TransactionRejectedError } from '../hooks/useSendSwapTransaction'
import { useSwapCallback } from '../hooks/useSwapCallback'
import { useSwapConfig } from '../hooks/useSwapConfig'
import { useSwapCurrency } from '../hooks/useSwapCurrency'
import { computeTradePriceBreakdown } from '../utils/exchange'
import { ConfirmSwapModalV2 } from './ConfirmSwapModalV2'

const SettingsModalWithCustomDismiss = withCustomOnDismiss(SettingsModal)

interface SwapCommitButtonPropsType {
  trade?: SmartRouterTrade<TradeType>
  tradeError?: Error
  tradeLoading?: boolean
}

const useSettingModal = () => {
  const [openSettingsModal] = useModal(
    <SettingsModalWithCustomDismiss
      customOnDismiss={() => console.debug('TODO')}
      // customOnDismiss={() => setIndirectlyOpenConfirmModalState(true)}
      mode={SettingsMode.SWAP_LIQUIDITY}
    />,
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
      {wrapInputError ?? (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
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

export const SwapCommitButtonV2: React.FC<SwapCommitButtonPropsType> = (props) => {
  return (
    <UnsupportedSwapButtonReplace>
      <ConnectButtonReplace>
        <WrapCommitButtonReplace>
          <SwapCommitButton {...props} />
        </WrapCommitButtonReplace>
      </ConnectButtonReplace>
    </UnsupportedSwapButtonReplace>
  )
}

const SwapCommitButton = memo(function SwapCommitButton({
  trade,
  tradeError,
  tradeLoading,
}: SwapCommitButtonPropsType) {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const chainId = useChainId()
  // form data
  const { typedValue, independentField } = useSwapState()
  console.debug('x', typedValue)
  const [inputCurrency, outputCurrency] = useSwapCurrency()
  const { isExpertMode, deadline } = useSwapConfig()

  const slippageAdjustedAmounts = useSlippageAdjustedAmounts(trade)
  const amountToApprove = useMemo(
    () => (inputCurrency?.isNative ? undefined : slippageAdjustedAmounts[Field.INPUT]),
    [inputCurrency?.isNative, slippageAdjustedAmounts],
  )

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ])
  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  }
  const parsedAmounts = useParsedAmounts(trade, currencyBalances, false)
  const parsedIndependentFieldAmount = parsedAmounts[independentField]
  const swapInputError = useSwapInputError(trade, currencyBalances)

  const [txHash, setTxHash] = useState<string | undefined>(undefined)
  const [swapErrorMessage, setSwapErrorMessage] = useState<string | undefined>(undefined)
  const [signature, setSignature] = useState<Permit2Signature | undefined>(undefined)
  const [tradeToConfirm, setTradeToConfirm] = useState<SmartRouterTrade<TradeType> | undefined>(undefined)
  const statusWallchain: string = '@TODO'
  const fn = useCallback(() => undefined, [])
  const {
    callback: swapCallback,
    error: swapCallbackError,
    reason: swapCallbackRevertReason,
  } = useSwapCallback({
    trade,
    deadline,
    permitSignature: signature, // TODO
    onWallchainDrop: fn, // TODO
    wallchainMasterInput: undefined, // TODO
    statusWallchain: 'not-found', // TODO
  })
  const onConfirmSwap = useCallback(async () => {
    // @todo preflight check

    if (!swapCallback) {
      if (swapCallbackRevertReason === 'insufficient allowance') {
        // TODO
      }
      return undefined
    }
    try {
      const result = await swapCallback()
      setTxHash(result.hash)
      return result
    } catch (error: any) {
      console.error(error)
      const userReject = isUserRejected(error) || error instanceof TransactionRejectedError

      if (!userReject) setSwapErrorMessage(typeof error === 'string' ? error : error?.message)

      throw error
    }
  }, [swapCallback, swapCallbackRevertReason])

  // todo
  const {
    execute: onStep,
    approvalState,
    permit2Signature,
  } = usePermit(amountToApprove, getUniversalRouterAddress(chainId), onConfirmSwap)
  useEffect(() => {
    setSignature(permit2Signature)
  }, [permit2Signature])

  const { confirmModalState, pendingModalSteps, resetConfirmModalState, startSwap } = useConfirmModalStateV2(
    onStep,
    amountToApprove,
    approvalState,
    permit2Signature,
    getUniversalRouterAddress(chainId),
  )
  const reset = useCallback(() => {
    resetConfirmModalState()
    setTxHash(undefined)
    setSwapErrorMessage(undefined)
    setTradeToConfirm(undefined)
  }, [resetConfirmModalState])

  const handleAcceptChanges = useCallback(() => {
    setTradeToConfirm(trade)
  }, [trade])

  const tradePriceBreakdown = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  // warnings on slippage
  const priceImpactSeverity = warningSeverity(
    tradePriceBreakdown ? tradePriceBreakdown.priceImpactWithoutFee : undefined,
  )

  const noRoute = useMemo(() => !((trade?.routes?.length ?? 0) > 0) || tradeError, [trade?.routes?.length, tradeError])
  const isValid = useMemo(() => !swapInputError && !tradeLoading, [swapInputError, tradeLoading])
  const disabled = useMemo(
    () =>
      !isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError || statusWallchain === 'pending',
    [isExpertMode, isValid, priceImpactSeverity, swapCallbackError],
  )

  const userHasSpecifiedInputOutput = Boolean(
    inputCurrency && outputCurrency && parsedIndependentFieldAmount?.greaterThan(BIG_INT_ZERO),
  )

  // modals
  const openSettingModal = useSettingModal()
  const [openConfirmSwapModal] = useModal(
    <ConfirmSwapModalV2
      trade={trade}
      originalTrade={tradeToConfirm}
      txHash={txHash}
      confirmModalState={confirmModalState}
      pendingModalSteps={pendingModalSteps}
      swapErrorMessage={swapErrorMessage}
      currencyBalances={currencyBalances}
      onAcceptChanges={handleAcceptChanges}
      onConfirm={startSwap}
      openSettingModal={openSettingModal}
      customOnDismiss={reset}
    />,
    true,
    true,
    'confirmSwapModal',
  )

  const handleSwap = useCallback(() => {
    setTradeToConfirm(trade)
    resetConfirmModalState()

    // if expert mode turn-on, will not show preview modal
    // start swap directly
    console.debug('debug: isExpertMode', isExpertMode)
    if (isExpertMode) {
      startSwap()
    }

    openConfirmSwapModal()
    logGTMClickSwapEvent()
  }, [isExpertMode, openConfirmSwapModal, resetConfirmModalState, startSwap, trade])

  if (noRoute && userHasSpecifiedInputOutput && !tradeLoading) {
    return <ResetRoutesButton />
  }

  return (
    <Box mt="0.25rem">
      <CommitButton
        id="swap-button"
        width="100%"
        variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'primary'}
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
