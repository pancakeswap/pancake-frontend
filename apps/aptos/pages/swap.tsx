import {
  Currency,
  CurrencyAmount,
  JSBI,
  Percent,
  Router,
  SWAP_ADDRESS_MODULE,
  Token,
  Trade,
  TradeType,
} from '@pancakeswap/aptos-swap-sdk'
import { useAccount } from '@pancakeswap/awgmi'
import { parseVmStatusError, SimulateTransactionError, UserRejectedRequestError } from '@pancakeswap/awgmi/core'
import { useTranslation } from '@pancakeswap/localization'
import { AtomBox } from '@pancakeswap/ui'
import {
  AutoColumn,
  Card,
  confirmPriceImpactWithoutFee,
  Flex,
  HistoryIcon,
  IconButton,
  Link,
  Modal,
  ModalV2,
  Skeleton,
  Swap as SwapUI,
  Text,
  useModal,
} from '@pancakeswap/uikit'
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { CurrencyInputPanel } from 'components/CurrencyInputPanel'
import { ExchangeLayout } from 'components/Layout/ExchangeLayout'
import { PageMeta } from 'components/Layout/Page'
import { SettingsButton } from 'components/Menu/Settings/SettingsButton'
import { SettingsModal, withCustomOnDismiss } from 'components/Menu/Settings/SettingsModal'
import ImportToken from 'components/SearchModal/ImportToken'
import AdvancedSwapDetailsDropdown from 'components/Swap/AdvancedSwapDetailsDropdown'
import ConfirmSwapModal from 'components/Swap/ConfirmSwapModal'
import useBridgeInfo from 'components/Swap/hooks/useBridgeInfo'
import { useWarningSwapModal } from 'components/SwapWarningModal'
import { ALLOWED_PRICE_IMPACT_HIGH, BIPS_BASE, PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN } from 'config/constants/exchange'
import { useCurrencyBalance } from 'hooks/Balances'
import { useAllTokens, useCurrency } from 'hooks/Tokens'
import { useTradeExactIn, useTradeExactOut } from 'hooks/Trades'
import { useActiveChainId, useActiveNetwork } from 'hooks/useNetwork'
import useSimulationAndSendTransaction from 'hooks/useSimulationAndSendTransaction'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Field, selectCurrency, switchCurrencies, typeInput, useDefaultsFromURLSearch, useSwapState } from 'state/swap'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useUserSlippage } from 'state/user'
import { useIsExpertMode } from 'state/user/expertMode'
import useSWRImmutable from 'swr/immutable'
import currencyId from 'utils/currencyId'
import {
  basisPointsToPercent,
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  warningSeverity,
} from 'utils/exchange'
import WalletModal, { WalletView } from 'components/Menu/WalletModal'
import formatAmountDisplay from 'utils/formatAmountDisplay'
import { maxAmountSpend } from 'utils/maxAmountSpend'
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

const SettingsModalWithCustomDismiss = withCustomOnDismiss(SettingsModal)

function useWarningImport(currencies: (Currency | undefined)[]) {
  const defaultTokens = useAllTokens()
  const { isWrongNetwork } = useActiveNetwork()
  const chainId = useActiveChainId()
  const { data: loadedTokenList } = useSWRImmutable(['token-list'])
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

  const isExpertMode = useIsExpertMode()

  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const shouldShowWarningModal = useWarningSwapModal()

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
      shouldShowWarningModal(currency)

      if (outputCurrency?.wrapped.equals(currency.wrapped) && inputCurrency) {
        replaceBrowserHistory('outputCurrency', currencyId(inputCurrency))
      }

      dispatch(selectCurrency({ field: Field.INPUT, currencyId: currency.wrapped.address }))
      replaceBrowserHistory('inputCurrency', currencyId(currency))
    },
    [dispatch, inputCurrency, outputCurrency?.wrapped, shouldShowWarningModal],
  )

  const handleOutputSelect = useCallback(
    (currency: Currency) => {
      shouldShowWarningModal(currency)

      if (inputCurrency?.wrapped.equals(currency.wrapped) && outputCurrency) {
        replaceBrowserHistory('inputCurrency', currencyId(outputCurrency))
      }

      dispatch(selectCurrency({ field: Field.OUTPUT, currencyId: currency.wrapped.address }))
      replaceBrowserHistory('outputCurrency', currencyId(currency))
    },
    [dispatch, inputCurrency?.wrapped, outputCurrency, shouldShowWarningModal],
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

  const handlePercentInput = useCallback(
    (percent) => {
      if (maxAmountInput) {
        dispatch(
          typeInput({ field: Field.INPUT, typedValue: maxAmountInput.multiply(new Percent(percent, 100)).toExact() }),
        )
      }
    },
    [dispatch, maxAmountInput],
  )

  const [indirectlyOpenConfirmModalState, setIndirectlyOpenConfirmModalState] = useState(false)
  const [onPresentSettingsCustomDismissModal] = useModal(
    <SettingsModalWithCustomDismiss customOnDismiss={() => setIndirectlyOpenConfirmModalState(true)} />,
  )

  const [onPresentSettingsModal] = useModal(<SettingsModal />)

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
        openSettingModal={onPresentSettingsCustomDismissModal}
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

  const { showBridgeWarning, bridgeResult } = useBridgeInfo({ currency: inputCurrency })

  const [onPresentTransactionsModal] = useModal(<WalletModal initialView={WalletView.TRANSACTIONS} />)

  return (
    <>
      <PageMeta title={t('Exchange')} />
      <Card style={{ width: '328px' }}>
        <CurrencyInputHeader
          title={
            <Flex width="100%" alignItems="center" justifyContent="center">
              <Flex flex="1" />
              <Flex flex="1" justifyContent="center">
                <CurrencyInputHeaderTitle>{t('Swap')}</CurrencyInputHeaderTitle>
              </Flex>
              <Flex flex="1" justifyContent="flex-end">
                {account && (
                  <IconButton onClick={onPresentTransactionsModal} variant="text" scale="sm">
                    <HistoryIcon color="textSubtle" width="24px" />
                  </IconButton>
                )}
                <SettingsButton />
              </Flex>
            </Flex>
          }
          subtitle={<CurrencyInputHeaderSubTitle>{t('Trade tokens in an instant')}</CurrencyInputHeaderSubTitle>}
        />
        <AutoColumn gap="sm" p="16px">
          <CurrencyInputPanel
            onCurrencySelect={handleInputSelect}
            id="swap-currency-input"
            currency={isLoaded ? inputCurrency : undefined}
            otherCurrency={outputCurrency}
            value={formattedAmounts[Field.INPUT]}
            onUserInput={(value) => dispatch(typeInput({ field: Field.INPUT, typedValue: value }))}
            showMaxButton
            onMax={handleMaxInput}
            maxAmount={maxAmountInput}
            showQuickInputButton
            onPercentInput={handlePercentInput}
            label={independentField === Field.OUTPUT && trade ? t('From (estimated)') : t('From')}
            showBridgeWarning={showBridgeWarning}
            showUSDPrice
          />
          {showBridgeWarning && (
            <AtomBox width="full">
              <Flex justifyContent="flex-end">
                <Text fontSize="12px" color="warning">
                  {t('Use')}
                </Text>
                <Link
                  external
                  m="0 4px"
                  fontSize="12px"
                  color="warning"
                  href={bridgeResult?.url}
                  style={{ textDecoration: 'underline' }}
                >
                  {bridgeResult?.platform}
                </Link>
                <Text fontSize="12px" color="warning">
                  {t('to bridge this asset.')}
                </Text>
              </Flex>
            </AtomBox>
          )}
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
            id="swap-currency-output"
            value={formattedAmounts[Field.OUTPUT]}
            label={independentField === Field.INPUT && trade ? t('To (estimated)') : t('to')}
            currency={isLoaded ? outputCurrency : undefined}
            otherCurrency={inputCurrency}
            onUserInput={(value) => dispatch(typeInput({ field: Field.OUTPUT, typedValue: value }))}
            showUSDPrice
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
            onSlippageClick={onPresentSettingsModal}
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
