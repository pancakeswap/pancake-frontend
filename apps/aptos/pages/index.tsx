import { AptosSwapRouter, Currency, CurrencyAmount, JSBI, Percent, Trade, TradeType } from '@pancakeswap/aptos-swap-sdk'
import { useAccount, useSendTransaction } from '@pancakeswap/awgmi'
import { useTranslation } from '@pancakeswap/localization'
import { AtomBox } from '@pancakeswap/ui'
import { AutoColumn, Card, RowBetween, Skeleton, Swap as SwapUI, useModal } from '@pancakeswap/uikit'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { CurrencyInputPanel } from 'components/CurrencyInputPanel'
import ConfirmSwapModal from 'components/Swap/ConfirmSwapModal'
import { TestTokens } from 'components/TestTokens'
import { USDC_DEVNET } from 'config/coins'
import { BIPS_BASE } from 'config/constants/exchange'
import { useCurrency, useCurrencyBalance } from 'hooks/Tokens'
import { useTradeExactIn, useTradeExactOut } from 'hooks/Trades'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Field, replaceSwapState, selectCurrency, switchCurrencies, typeInput, useSwapState } from 'state/swap'
import { useUserSlippage } from 'state/user'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from 'utils/exchange'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { CommitButton } from '../components/CommitButton'

const {
  Page,
  CurrencyInputHeader,
  CurrencyInputHeaderTitle,
  CurrencyInputHeaderSubTitle,
  SwitchButton,
  Info,
  InfoLabel,
  TradePrice,
} = SwapUI

const isExpertMode = false

const SwapPage = () => {
  const native = useNativeCurrency()
  const [
    {
      typedValue,
      independentField,
      [Field.INPUT]: { currencyId: inputCurrencyId },
      [Field.OUTPUT]: { currencyId: outputCurrencyId },
    },
    dispatch,
  ] = useSwapState()

  useEffect(() => {
    dispatch(
      replaceSwapState({
        field: Field.INPUT,
        recipient: null,
        typedValue: '',
        inputCurrencyId: native.address,
        outputCurrencyId: USDC_DEVNET.address,
      }),
    )
  }, [dispatch, native])

  const { t } = useTranslation()

  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const isExactIn: boolean = independentField === Field.INPUT
  const parsedAmount = tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined)

  const bestTradeExactIn = useTradeExactIn(isExactIn ? parsedAmount : undefined, outputCurrency ?? undefined)
  const bestTradeExactOut = useTradeExactOut(inputCurrency ?? undefined, !isExactIn ? parsedAmount : undefined)

  const trade = isExactIn ? bestTradeExactIn : bestTradeExactOut

  const { sendTransactionAsync } = useSendTransaction()

  const parsedAmounts = {
    [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
    [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
  }

  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const [allowedSlippage] = useUserSlippage()

  const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    tradeToConfirm: Trade<Currency, Currency, TradeType> | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const address = useAccount()?.account?.address

  const recipient = address ?? null

  const currencyBalances = {
    [Field.INPUT]: useCurrencyBalance(inputCurrencyId),
    [Field.OUTPUT]: useCurrencyBalance(outputCurrencyId),
  }

  const swapCallback = useMemo(() => {
    if (trade) {
      return () =>
        sendTransactionAsync({
          payload: AptosSwapRouter.swapCallParameters(trade, {
            allowedSlippage: new Percent(JSBI.BigInt(50), BIPS_BASE),
          }),
        })
    }
    return undefined
  }, [sendTransactionAsync, trade])

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const handleSwap = useCallback(() => {
    // if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee, t)) {
    //   return
    // }
    if (!swapCallback) return

    setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then((tx) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: tx.hash })
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
    setSwapState({ tradeToConfirm: trade ?? undefined, swapErrorMessage, txHash, attemptingTxn })
  }, [attemptingTxn, swapErrorMessage, trade, txHash, setSwapState])

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      dispatch(typeInput({ field: Field.INPUT, typedValue: '' }))
    }
  }, [tradeToConfirm, attemptingTxn, swapErrorMessage, txHash, dispatch])

  const maxAmountInput: CurrencyAmount<Currency> | undefined = maxAmountSpend(currencyBalances[Field.INPUT])

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      dispatch(typeInput({ field: Field.INPUT, typedValue: maxAmountInput.toExact() }))
    }
  }, [dispatch, maxAmountInput])

  const [onPresentConfirmModal] = useModal(
    trade && (
      <ConfirmSwapModal
        trade={trade}
        originalTrade={tradeToConfirm}
        currencyBalances={currencyBalances}
        onAcceptChanges={handleAcceptChanges}
        attemptingTxn={attemptingTxn}
        txHash={txHash}
        recipient={recipient}
        allowedSlippage={allowedSlippage}
        onConfirm={handleSwap}
        swapErrorMessage={swapErrorMessage}
        customOnDismiss={handleConfirmDismiss}
        openSettingModal={() => {
          //
        }}
      />
    ),
    true,
    true,
    'confirmSwapModal',
  )

  let inputError: string | undefined
  if (!parsedAmount) {
    inputError = inputError ?? t('Enter an amount')
  }

  const slippageAdjustedAmounts = trade && allowedSlippage && computeSlippageAdjustedAmounts(trade, allowedSlippage)

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [
    currencyBalances[Field.INPUT],
    slippageAdjustedAmounts ? slippageAdjustedAmounts[Field.INPUT] : null,
  ]

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = t('Insufficient %symbol% balance', { symbol: amountIn.currency.symbol })
  }

  if (!inputCurrency || !outputCurrency) {
    inputError = inputError ?? t('Select a token')
  }

  const isValid = !inputError

  return (
    <Page helpUrl="https://docs.pancakeswap.finance/products/pancakeswap-exchange" isEvm={false}>
      <Card style={{ width: '328px' }}>
        <CurrencyInputHeader
          title={
            <RowBetween>
              <div />
              <CurrencyInputHeaderTitle>{t('Swap')}</CurrencyInputHeaderTitle>
              <div />
            </RowBetween>
          }
          subtitle={<CurrencyInputHeaderSubTitle>{t('Trade tokens in an instant')}</CurrencyInputHeaderSubTitle>}
        />
        <AutoColumn gap="sm" p="16px">
          <CurrencyInputPanel
            onCurrencySelect={(c) => dispatch(selectCurrency({ field: Field.INPUT, currencyId: c.wrapped.address }))}
            id="swap-currency-input"
            currency={inputCurrency}
            otherCurrency={outputCurrency}
            value={formattedAmounts[Field.INPUT]}
            onUserInput={(value) => dispatch(typeInput({ field: Field.INPUT, typedValue: value }))}
            showMaxButton
            onMax={handleMaxInput}
            label={independentField === Field.OUTPUT && trade ? t('From (estimated)') : t('From')}
          />
          <AtomBox width="full" textAlign="center">
            <SwitchButton
              onClick={() => {
                dispatch(switchCurrencies())
              }}
            />
          </AtomBox>
          <CurrencyInputPanel
            showMaxButton={false}
            onCurrencySelect={(c) => dispatch(selectCurrency({ field: Field.OUTPUT, currencyId: c.wrapped.address }))}
            id="swap-currency-output"
            value={formattedAmounts[Field.OUTPUT]}
            label={independentField === Field.INPUT && trade ? t('To (estimated)') : t('to')}
            currency={outputCurrency}
            otherCurrency={inputCurrency}
            onUserInput={(value) => dispatch(typeInput({ field: Field.OUTPUT, typedValue: value }))}
          />

          <Info
            price={
              <>
                <InfoLabel>{t('Price')}</InfoLabel>
                {!trade ? <Skeleton ml="8px" height="24px" /> : <TradePrice price={trade?.executionPrice} />}
              </>
            }
            allowedSlippage={allowedSlippage}
          />
          <AtomBox>
            <CommitButton
              width="100%"
              variant={priceImpactSeverity > 2 ? 'danger' : 'primary'}
              disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode)}
              onClick={() => {
                if (trade) {
                  setSwapState({
                    tradeToConfirm: trade,
                    attemptingTxn: false,
                    swapErrorMessage: undefined,
                    txHash: undefined,
                  })
                  onPresentConfirmModal()
                }
                // if (trade) {
                // sendTransactionAsync({
                //   payload: AptosSwapRouter.swapCallParameters(trade, {
                //     allowedSlippage: new Percent(JSBI.BigInt(50), BIPS_BASE),
                //   }),
                // }).then((r) => r.wait())
                // }
              }}
            >
              {inputError ||
                (priceImpactSeverity > 3 && !isExpertMode
                  ? t('Price Impact High')
                  : priceImpactSeverity > 2
                  ? t('Swap Anyway')
                  : t('Swap'))}
            </CommitButton>
          </AtomBox>
        </AutoColumn>
      </Card>
      <TestTokens />
    </Page>
  )
}

export default SwapPage
