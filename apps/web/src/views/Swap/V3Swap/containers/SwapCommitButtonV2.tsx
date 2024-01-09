import { TradeType } from '@pancakeswap/sdk'
import { SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { Currency } from '@pancakeswap/swap-sdk-core'
import { AutoColumn, Box, Button, Dots, Message, MessageText, Text, useModal } from '@pancakeswap/uikit'
import React, { memo, useMemo } from 'react'

import { useTranslation } from '@pancakeswap/localization'
import { useExpertMode } from '@pancakeswap/utils/user'
import { GreyCard } from 'components/Card'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { AutoRow } from 'components/Layout/Row'
import SettingsModal, { RoutingSettingsButton, withCustomOnDismiss } from 'components/Menu/GlobalSettings/SettingsModal'
import { SettingsMode } from 'components/Menu/GlobalSettings/types'
import { BIG_INT_ZERO } from 'config/constants/exchange'
import { useCurrency } from 'hooks/Tokens'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { useRoutingSettingChanged } from 'state/user/smartRouter'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { logGTMClickSwapEvent } from 'utils/customGTMEventTracking'
import { warningSeverity } from 'utils/exchange'
import { useAccount, useChainId } from 'wagmi'
import { useParsedAmounts, useSwapInputError } from '../hooks'
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

const useConfirmSwapModal = () => {
  const [openConfirmSwapModal] = useModal(<ConfirmSwapModalV2 />, true, true, 'confirmSwapModal')
  return openConfirmSwapModal
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
  const {
    typedValue,
    independentField,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId) as Currency
  const outputCurrency = useCurrency(outputCurrencyId) as Currency
  const [isExpertMode] = useExpertMode()
  const deadline = useTransactionDeadline()

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

  // modals
  const openSettingModal = useSettingModal()
  const openConfirmSwapModal = useConfirmSwapModal()

  // todo
  const statusWallchain: string = '@TODO'
  const swapCallbackError = undefined // TODO
  const handleSwap = () => {
    openConfirmSwapModal()
    logGTMClickSwapEvent()
  }

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
