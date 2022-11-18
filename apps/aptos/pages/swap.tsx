import {
  Router,
  Currency,
  CurrencyAmount,
  JSBI,
  Percent,
  SWAP_ADDRESS_MODULE,
  Trade,
  TradeType,
  Token,
} from '@pancakeswap/aptos-swap-sdk'
import { APTOS_COIN, useAccount } from '@pancakeswap/awgmi'
import { parseVmStatusError, SimulateTransactionError, UserRejectedRequestError } from '@pancakeswap/awgmi/core'
import { useTranslation } from '@pancakeswap/localization'
import { AtomBox } from '@pancakeswap/ui'
import { AutoColumn, Card, Skeleton, Swap as SwapUI, useModal, Flex, ModalV2, Modal } from '@pancakeswap/uikit'
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { CurrencyInputPanel } from 'components/CurrencyInputPanel'
import { ExchangeLayout } from 'components/Layout/ExchangeLayout'
import { PageMeta } from 'components/Layout/Page'
import { SettingsButton } from 'components/Menu/Settings/SettingsButton'
import { SettingsModal, withCustomOnDismiss } from 'components/Menu/Settings/SettingsModal'
import ImportToken from 'components/SearchModal/ImportToken'
import AdvancedSwapDetailsDropdown from 'components/Swap/AdvancedSwapDetailsDropdown'
import confirmPriceImpactWithoutFee from 'components/Swap/confirmPriceImpactWithoutFee'
import ConfirmSwapModal from 'components/Swap/ConfirmSwapModal'
import { DOMAIN } from 'config'
import { BIPS_BASE } from 'config/constants/exchange'
import { useCurrencyBalance } from 'hooks/Balances'
import { useAllTokens, useCurrency } from 'hooks/Tokens'
import { useTradeExactIn, useTradeExactOut } from 'hooks/Trades'
import { useActiveChainId, useActiveNetwork } from 'hooks/useNetwork'
import useSimulationAndSendTransaction from 'hooks/useSimulationAndSendTransaction'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Field, selectCurrency, switchCurrencies, typeInput, useDefaultsFromURLSearch, useSwapState } from 'state/swap'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useUserSlippage } from 'state/user'
import currencyId from 'utils/currencyId'
import {
  basisPointsToPercent,
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  warningSeverity,
} from 'utils/exchange'
import formatAmountDisplay from 'utils/formatAmountDisplay'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import useSWRImuutable from 'swr/immutable'
import { CommitButton } from '../components/CommitButton'

const {
  CurrencyInputHeader,
  CurrencyInputHeaderTitle,
  CurrencyInputHeaderSubTitle,
  SwitchButton,
  Info,
  InfoLabel,
  TradePrice,
} = SwapUI

const isExpertMode = false

const SettingsModalWithCustomDismiss = withCustomOnDismiss(SettingsModal)

function useWarningImport(currencies: (Currency | undefined)[]) {
  const defaultTokens = useAllTokens()
  const { isWrongNetwork } = useActiveNetwork()
  const chainId = useActiveChainId()
  const { data: loadedTokenList } = useSWRImuutable(['token-list'])
  const urlLoadedTokens = useMemo(() => currencies.filter((c): c is Token => Boolean(c?.isToken)), [currencies])
  const isLoaded = !!loadedTokenList
  const importTokensNotInDefault = useMemo(() => {
    return !isWrongNetwork && urlLoadedTokens && isLoaded
      ? urlLoadedTokens.filter((token) => {
          return !(token.address in defaultTokens) && token.chainId === chainId
        })
      : []
  }, [chainId, defaultTokens, isLoaded, isWrongNetwork, urlLoadedTokens])

  return importTokensNotInDefault
}

const SwapPage = () => {
  const [
    {
      typedValue,
      independentField,
      [Field.INPUT]: { currencyId: inputCurrencyId },
      [Field.OUTPUT]: { currencyId: outputCurrencyId },
    },
    dispatch,
  ] = useSwapState()

  const isLoaded = useDefaultsFromURLSearch()

  const { t } = useTranslation()

  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const isExactIn: boolean = independentField === Field.INPUT

  const parsedAmount = tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined)

  const bestTradeExactIn = useTradeExactIn(isExactIn ? parsedAmount : undefined, outputCurrency ?? undefined)
  const bestTradeExactOut = useTradeExactOut(inputCurrency ?? undefined, !isExactIn ? parsedAmount : undefined)

  const trade = isExactIn ? bestTradeExactIn : bestTradeExactOut

  const addTransaction = useTransactionAdder()

  const warningTokens = useWarningImport(
    useMemo(() => [inputCurrency, outputCurrency], [inputCurrency, outputCurrency]),
  )

  const parsedAmounts = {
    [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
    [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
  }

  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: formatAmountDisplay(parsedAmounts[dependentField]),
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

  const { account } = useAccount()
  const address = account?.address

  const recipient = address ?? null

  const currencyBalances = {
    [Field.INPUT]: useCurrencyBalance(inputCurrencyId),
    [Field.OUTPUT]: useCurrencyBalance(outputCurrencyId),
  }

  const executeTransaction = useSimulationAndSendTransaction()

  const [userAllowedSlippage] = useUserSlippage()

  const swapCallback = useMemo(() => {
    if (trade) {
      return async () => {
        const payload = Router.swapCallParameters(trade, {
          allowedSlippage: new Percent(JSBI.BigInt(userAllowedSlippage), BIPS_BASE),
        })
        if (!payload) {
          throw new Error('Missing swap call')
        }

        return executeTransaction(payload, (error) => {
          if (error instanceof SimulateTransactionError) {
            console.info({ error })
            const parseError = parseVmStatusError(error.tx.vm_status)
            // TODO: aptos figure out the error pattern later
            if (!parseError) {
              throw new Error(error.tx.vm_status)
            }
            if (parseError && parseError.module && parseError.module !== SWAP_ADDRESS_MODULE) {
              throw new Error(parseError.message)
            }
            // TODO: show corresponding swap error
            throw new Error(
              t(
                'An error occurred when trying to execute this operation. You may need to increase your slippage tolerance. If that does not work, there may be an incompatibility with the token you are trading.',
              ),
            )
          }
        }).then((tx) => {
          const inputSymbol = trade.inputAmount.currency.symbol
          const outputSymbol = trade.outputAmount.currency.symbol
          const pct = basisPointsToPercent(allowedSlippage)
          const inputAmount =
            trade.tradeType === TradeType.EXACT_INPUT
              ? trade.inputAmount.toSignificant(3)
              : trade.maximumAmountIn(pct).toSignificant(3)
          const outputAmount =
            trade.tradeType === TradeType.EXACT_OUTPUT
              ? trade.outputAmount.toSignificant(3)
              : trade.minimumAmountOut(pct).toSignificant(3)

          const summary = `Swap ${
            trade.tradeType === TradeType.EXACT_OUTPUT ? 'max.' : ''
          } ${inputAmount} ${inputSymbol} for ${
            trade.tradeType === TradeType.EXACT_INPUT ? 'min.' : ''
          } ${outputAmount} ${outputSymbol}`

          const text =
            trade.tradeType === TradeType.EXACT_OUTPUT
              ? 'Swap max. %inputAmount% %inputSymbol% for %outputAmount% %outputSymbol%'
              : 'Swap %inputAmount% %inputSymbol% for min. %outputAmount% %outputSymbol%'

          addTransaction(tx, {
            summary,
            translatableSummary: {
              text,
              data: {
                inputAmount,
                inputSymbol,
                outputAmount,
                outputSymbol,
              },
            },
            type: 'swap',
          })

          return tx
        })
      }
    }
    return undefined
  }, [addTransaction, allowedSlippage, executeTransaction, t, trade, userAllowedSlippage])

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee, t)) {
      return
    }
    if (!swapCallback) return

    setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then((tx) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: tx.hash })
      })
      .catch((error) => {
        if (error instanceof UserRejectedRequestError) {
          setSwapState((s) => ({
            ...s,
            attemptingTxn: false,
          }))
          return
        }
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [priceImpactWithoutFee, t, swapCallback, tradeToConfirm])

  const handleInputSelect = useCallback(
    (currency: Currency) => {
      if (outputCurrency?.wrapped.equals(currency.wrapped) && inputCurrency) {
        replaceBrowserHistory('outputCurrency', currencyId(inputCurrency))
      }

      dispatch(selectCurrency({ field: Field.INPUT, currencyId: currency.wrapped.address }))
      replaceBrowserHistory('inputCurrency', currencyId(currency))
    },
    [dispatch, inputCurrency, outputCurrency],
  )

  const handleOutputSelect = useCallback(
    (currency: Currency) => {
      if (inputCurrency?.wrapped.equals(currency.wrapped) && outputCurrency) {
        replaceBrowserHistory('inputCurrency', currencyId(outputCurrency))
      }

      dispatch(selectCurrency({ field: Field.OUTPUT, currencyId: currency.wrapped.address }))
      replaceBrowserHistory('outputCurrency', currencyId(currency))
    },
    [dispatch, inputCurrency, outputCurrency],
  )

  const handleSwitch = useCallback(() => {
    dispatch(switchCurrencies())
    replaceBrowserHistory('inputCurrency', outputCurrencyId)
    replaceBrowserHistory('outputCurrency', inputCurrencyId)
  }, [dispatch, inputCurrencyId, outputCurrencyId])

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

  const [indirectlyOpenConfirmModalState, setIndirectlyOpenConfirmModalState] = useState(false)
  const [onPresentSettingsModal] = useModal(
    <SettingsModalWithCustomDismiss customOnDismiss={() => setIndirectlyOpenConfirmModalState(true)} />,
  )

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
        openSettingModal={onPresentSettingsModal}
      />
    ),
    true,
    true,
    'confirmSwapModal',
  )

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

  // NOTE: balanceIn is undefined mean no balance in Aptos
  if (amountIn && (!balanceIn || balanceIn.lessThan(amountIn))) {
    inputError = t('Insufficient %symbol% balance', { symbol: amountIn.currency.symbol })
  }

  if (!inputCurrency || !outputCurrency) {
    inputError = inputError ?? t('Select a token')
  }

  const isValid = !inputError

  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  return (
    <>
      <PageMeta title={t('Exchange')} />
      <Card style={{ width: '328px' }}>
        <CurrencyInputHeader
          title={
            <Flex width="100%" ml={32}>
              <Flex flexDirection="column" alignItems="center" width="100%">
                <CurrencyInputHeaderTitle>{t('Swap')}</CurrencyInputHeaderTitle>
              </Flex>
              <SettingsButton />
            </Flex>
          }
          subtitle={<CurrencyInputHeaderSubTitle>{t('Trade tokens in an instant')}</CurrencyInputHeaderSubTitle>}
        />
        <AutoColumn gap="sm" p="16px">
          <CurrencyInputPanel
            onCurrencySelect={handleInputSelect}
            id="swap-currency-input"
            shareLink={
              inputCurrency && inputCurrency.isToken
                ? `${DOMAIN}/swap?inputCurrency=${encodeURIComponent(APTOS_COIN)}&outputCurrency=${encodeURIComponent(
                    inputCurrency.address,
                  )}`
                : undefined
            }
            currency={isLoaded ? inputCurrency : undefined}
            otherCurrency={outputCurrency}
            value={formattedAmounts[Field.INPUT]}
            onUserInput={(value) => dispatch(typeInput({ field: Field.INPUT, typedValue: value }))}
            showMaxButton={!atMaxAmountInput}
            onMax={handleMaxInput}
            label={independentField === Field.OUTPUT && trade ? t('From (estimated)') : t('From')}
          />
          <AtomBox width="full" textAlign="center">
            <SwitchButton
              onClick={() => {
                handleSwitch()
              }}
            />
          </AtomBox>
          <CurrencyInputPanel
            showMaxButton={false}
            onCurrencySelect={handleOutputSelect}
            shareLink={
              outputCurrency && outputCurrency.isToken
                ? `${DOMAIN}/swap?inputCurrency=${encodeURIComponent(APTOS_COIN)}&outputCurrency=${encodeURIComponent(
                    outputCurrency.address,
                  )}`
                : undefined
            }
            id="swap-currency-output"
            value={formattedAmounts[Field.OUTPUT]}
            label={independentField === Field.INPUT && trade ? t('To (estimated)') : t('to')}
            currency={isLoaded ? outputCurrency : undefined}
            otherCurrency={inputCurrency}
            onUserInput={(value) => dispatch(typeInput({ field: Field.OUTPUT, typedValue: value }))}
          />

          <Info
            price={
              trade?.executionPrice?.greaterThan(0) ? (
                <>
                  <InfoLabel>{t('Price')}</InfoLabel>
                  {!trade ? <Skeleton ml="8px" height="24px" /> : <TradePrice price={trade?.executionPrice} />}
                </>
              ) : null
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
        {trade && <AdvancedSwapDetailsDropdown trade={trade} />}
        <ModalV2 isOpen={Boolean(warningTokens.length)}>
          <Modal title={t('Import Token')} hideCloseButton>
            <div style={{ maxWidth: '380px' }}>
              <ImportToken tokens={warningTokens} />
            </div>
          </Modal>
        </ModalV2>
      </Card>
    </>
  )
}

SwapPage.Layout = ExchangeLayout

export default SwapPage
