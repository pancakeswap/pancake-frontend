import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Percent, Token, Trade, TradeType } from '@pancakeswap/sdk'
import { AutoColumn, BottomDrawer, Box, Button, Flex, Link, useMatchBreakpoints, useModal } from '@pancakeswap/uikit'
import { Swap as SwapUI } from '@pancakeswap/widgets-internal'

import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import AccessRisk from 'components/AccessRisk'
import { ACCESS_TOKEN_SUPPORT_CHAIN_IDS } from 'components/AccessRisk/config/supportedChains'
import { AppBody } from 'components/App'
import ConnectWalletButton from 'components/ConnectWalletButton'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { GELATO_NATIVE } from 'config/constants'
import { LIMIT_ORDERS_DOCS_URL } from 'config/constants/exchange'
import useGasOverhead from 'hooks/limitOrders/useGasOverhead'
import useGelatoLimitOrders from 'hooks/limitOrders/useGelatoLimitOrders'
import { ApprovalState, useApproveCallbackFromInputCurrencyAmount } from 'hooks/useApproveCallback'
import useTheme from 'hooks/useTheme'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDefaultsFromURLSearch } from 'state/limitOrders/hooks'
import { Field } from 'state/limitOrders/types'
import { useExchangeChartManager } from 'state/user/hooks'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import PriceChartContainer from 'views/Swap/components/Chart/PriceChartContainer'

import { CommonBasesType } from 'components/SearchModal/types'
import { useAllTokens, useCurrency } from 'hooks/Tokens'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { currencyId } from 'utils/currencyId'
import ImportTokenWarningModal from '../../components/ImportTokenWarningModal'
import Page from '../Page'
import ClaimWarning from './components/ClaimWarning'
import { ConfirmLimitOrderModal } from './components/ConfirmLimitOrderModal'
import CurrencyInputHeader from './components/CurrencyInputHeader'
import LimitOrderPrice from './components/LimitOrderPrice'
import LimitOrderTable from './components/LimitOrderTable'
import SwitchTokensButton from './components/SwitchTokensButton'
import { StyledInputCurrencyWrapper, StyledSwapContainer, Wrapper } from './styles'
import getRatePercentageDifference from './utils/getRatePercentageDifference'

const LimitOrders = () => {
  // Helpers
  const { account, chainId } = useAccountActiveChain()
  const { t } = useTranslation()
  const router = useRouter()
  const { isMobile, isTablet, isDesktop } = useMatchBreakpoints()
  const { theme } = useTheme()
  const [isChartDisplayed, setIsChartDisplayed] = useExchangeChartManager(isMobile)
  const [isChartExpanded, setIsChartExpanded] = useState(false)

  const loadedUrlParams = useDefaultsFromURLSearch()
  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c?.isToken ?? false) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  )

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens()
  const importTokensNotInDefault = useMemo(() => {
    return (
      urlLoadedTokens &&
      urlLoadedTokens.filter((token: Token) => {
        return !(token.address in defaultTokens) && token.chainId === chainId
      })
    )
  }, [defaultTokens, urlLoadedTokens, chainId])

  const [onPresentImportTokenWarningModal] = useModal(
    <ImportTokenWarningModal tokens={importTokensNotInDefault} onCancel={() => router.push('/limit-orders')} />,
    false,
    false,
    'limitOrderTokenWarningModal',
  )

  useEffect(() => {
    if (importTokensNotInDefault.length > 0) {
      onPresentImportTokenWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importTokensNotInDefault.length])

  // TODO: fiat values

  const {
    handlers: { handleInput, handleCurrencySelection, handleSwitchTokens, handleLimitOrderSubmission, handleRateType },
    derivedOrderInfo: {
      currencies,
      currencyBalances,
      parsedAmounts,
      formattedAmounts,
      rawAmounts,
      trade,
      price,
      inputError,
      wrappedCurrencies,
      singleTokenPrice,
      currencyIds,
    },
    orderState: { independentField, basisField, rateType },
  } = useGelatoLimitOrders()

  const [{ swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
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

  const { approvalState, approveCallback } = useApproveCallbackFromInputCurrencyAmount(parsedAmounts.input)

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  const maxAmountInput: CurrencyAmount<Currency> | undefined = maxAmountSpend(currencyBalances.input)

  // Trade execution price is always "in MUL mode", even if UI handles DIV rate
  const currentMarketRate = trade?.executionPrice
  const percentageRateDifference = getRatePercentageDifference(currentMarketRate, price)

  // UI handlers
  const handleTypeInput = useCallback(
    (value: string) => {
      handleInput(Field.INPUT, value)
    },
    [handleInput],
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      handleInput(Field.OUTPUT, value)
    },
    [handleInput],
  )
  const handleInputSelect = useCallback(
    (newInputCurrency) => {
      setApprovalSubmitted(false)
      handleCurrencySelection(Field.INPUT, newInputCurrency)

      const newInputCurrencyId = currencyId(newInputCurrency)
      if (newInputCurrencyId === currencyIds.output) {
        replaceBrowserHistory('outputCurrency', currencyIds.input)
      }
      replaceBrowserHistory('inputCurrency', newInputCurrencyId)
    },
    [currencyIds.input, currencyIds.output, handleCurrencySelection],
  )
  const handleTypeDesiredRate = useCallback(
    (value: string) => {
      handleInput(Field.PRICE, value)
    },
    [handleInput],
  )
  const handlePercentInput = useCallback(
    (percent) => {
      if (maxAmountInput) {
        handleInput(Field.INPUT, maxAmountInput.multiply(new Percent(percent, 100)).toExact())
      }
    },
    [maxAmountInput, handleInput],
  )
  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      handleInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, handleInput])
  const handleOutputSelect = useCallback(
    (newOutputCurrency) => {
      handleCurrencySelection(Field.OUTPUT, newOutputCurrency)

      const newOutputCurrencyId = currencyId(newOutputCurrency)
      if (newOutputCurrencyId === currencyIds.input) {
        replaceBrowserHistory('inputCurrency', currencyIds.output)
      }
      replaceBrowserHistory('outputCurrency', newOutputCurrencyId)
    },
    [currencyIds.input, currencyIds.output, handleCurrencySelection],
  )
  const handleApprove = useCallback(async () => {
    await approveCallback()
  }, [approveCallback])

  const handleConfirmDismiss = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      handleTypeInput('')
    }
  }, [txHash, handleTypeInput])

  // Trick to reset to market price via fake update on the basis field
  const handleResetToMarketPrice = useCallback(() => {
    if (basisField === Field.INPUT) {
      handleTypeInput(formattedAmounts.input)
    } else {
      handleTypeOutput(formattedAmounts.output)
    }
  }, [handleTypeInput, handleTypeOutput, formattedAmounts.input, formattedAmounts.output, basisField])

  const handlePlaceOrder = useCallback(() => {
    if (!handleLimitOrderSubmission) {
      return
    }
    setSwapState((prev) => ({
      attemptingTxn: true,
      tradeToConfirm: prev.tradeToConfirm,
      swapErrorMessage: undefined,
      txHash: undefined,
    }))

    try {
      if (!wrappedCurrencies.input?.address) {
        throw new Error('Invalid input currency')
      }
      if (!wrappedCurrencies.output?.address) {
        throw new Error('Invalid output currency')
      }
      if (!rawAmounts.input) {
        throw new Error('Invalid input amount')
      }
      if (!rawAmounts.output) {
        throw new Error('Invalid output amount')
      }

      if (!account) {
        throw new Error('No account')
      }
      const inputToken = currencies.input?.isToken ? wrappedCurrencies.input?.address : GELATO_NATIVE
      const outputToken = currencies.output?.isToken ? wrappedCurrencies.output?.address : GELATO_NATIVE

      const orderToSubmit = {
        inputToken,
        outputToken,
        inputAmount: rawAmounts.input,
        outputAmount: rawAmounts.output,
        owner: account,
      }
      handleLimitOrderSubmission(orderToSubmit)
        .then(({ hash }) => {
          setSwapState((prev) => ({
            attemptingTxn: false,
            tradeToConfirm: prev.tradeToConfirm,
            swapErrorMessage: undefined,
            txHash: hash,
          }))
        })
        .catch((error) => {
          setSwapState((prev) => ({
            attemptingTxn: false,
            tradeToConfirm: prev.tradeToConfirm,
            swapErrorMessage: error.message,
            txHash: undefined,
          }))
        })
    } catch (error) {
      console.error(error)
    }
  }, [
    handleLimitOrderSubmission,
    account,
    rawAmounts.input,
    rawAmounts.output,
    currencies.input,
    currencies.output,
    wrappedCurrencies.input?.address,
    wrappedCurrencies.output?.address,
  ])

  const handleTokenSwitch = useCallback(() => {
    setApprovalSubmitted(false)
    handleSwitchTokens()
    replaceBrowserHistory('inputCurrency', currencyIds.output)
    replaceBrowserHistory('outputCurrency', currencyIds.input)
  }, [handleSwitchTokens, currencyIds.output, currencyIds.input])

  const { realExecutionPriceAsString } = useGasOverhead(parsedAmounts.input, parsedAmounts.output, rateType)

  const [showConfirmModal] = useModal(
    <ConfirmLimitOrderModal
      currencies={currencies}
      formattedAmounts={formattedAmounts}
      currentMarketRate={currentMarketRate?.toSignificant(4)}
      currentMarketRateInverted={currentMarketRate?.invert().toSignificant(4)}
      limitPrice={price?.toSignificant(6)}
      limitPriceInverted={price?.invert().toSignificant(6)}
      percentageRateDifference={parseFloat(
        percentageRateDifference ? percentageRateDifference.toSignificant(3) : '',
      ).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
      })}
      onConfirm={handlePlaceOrder}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      customOnDismiss={handleConfirmDismiss}
      swapErrorMessage={swapErrorMessage}
    />,
    true,
    true,
    'confirmLimitOrderModal',
  )

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approvalState, approvalSubmitted])

  const showApproveFlow =
    !inputError && (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING)

  const isSideFooter = isChartExpanded || isChartDisplayed

  const isAccessTokenSupported = chainId && ACCESS_TOKEN_SUPPORT_CHAIN_IDS.includes(chainId)

  return (
    <Page
      removePadding={isChartExpanded}
      hideFooterOnDesktop={isSideFooter}
      noMinHeight
      helpUrl={LIMIT_ORDERS_DOCS_URL}
    >
      <ClaimWarning />
      <Flex
        width="100%"
        height="100%"
        justifyContent="center"
        position="relative"
        mb={isSideFooter ? null : '24px'}
        mt={isChartExpanded ? '24px' : null}
      >
        {isDesktop && (
          <Flex width={isChartExpanded ? '100%' : '50%'} maxWidth="928px" flexDirection="column">
            <PriceChartContainer
              inputCurrency={currencies.input}
              outputCurrency={currencies.output}
              isChartExpanded={isChartExpanded}
              setIsChartExpanded={setIsChartExpanded}
              isChartDisplayed={isChartDisplayed}
              currentSwapPrice={singleTokenPrice}
              isFullWidthContainer
            />
            {isChartDisplayed && <Box mb="48px" />}
            <Box width="100%">
              <LimitOrderTable isCompact={isTablet} />
            </Box>
          </Flex>
        )}
        <Flex flexDirection="column" alignItems="center">
          <StyledSwapContainer $isChartExpanded={false}>
            <StyledInputCurrencyWrapper>
              <AppBody>
                <CurrencyInputHeader
                  title={t('Limit')}
                  subtitle={t('Place a limit order to trade at a set price')}
                  setIsChartDisplayed={setIsChartDisplayed}
                  isChartDisplayed={isChartDisplayed}
                />
                <Wrapper id="limit-order-page" style={{ minHeight: '412px' }}>
                  <AutoColumn gap="sm">
                    <CurrencyInputPanel
                      label={independentField === Field.OUTPUT ? t('From (estimated)') : t('From')}
                      value={formattedAmounts.input}
                      showQuickInputButton
                      showMaxButton
                      maxAmount={maxAmountInput}
                      currency={currencies.input}
                      onUserInput={handleTypeInput}
                      onPercentInput={handlePercentInput}
                      onMax={handleMaxInput}
                      onCurrencySelect={handleInputSelect}
                      otherCurrency={currencies.output}
                      id="limit-order-currency-input"
                      showCommonBases
                      commonBasesType={CommonBasesType.SWAP_LIMITORDER}
                      showUSDPrice
                    />

                    <Box id="yo">
                      {isAccessTokenSupported && currencies.input && currencies.input.isToken && (
                        <AccessRisk token={currencies.input} />
                      )}
                    </Box>

                    <SwitchTokensButton
                      handleSwitchTokens={handleTokenSwitch}
                      color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? 'primary' : 'text'}
                    />
                    <CurrencyInputPanel
                      value={formattedAmounts.output}
                      onUserInput={handleTypeOutput}
                      label={independentField === Field.INPUT ? t('To (estimated)') : t('To')}
                      showMaxButton={false}
                      currency={currencies.output}
                      onCurrencySelect={handleOutputSelect}
                      otherCurrency={currencies.output}
                      id="limit-order-currency-output"
                      showCommonBases
                      commonBasesType={CommonBasesType.SWAP_LIMITORDER}
                      showUSDPrice
                    />
                    <Box>
                      {isAccessTokenSupported && currencies.output && currencies.output.isToken && (
                        <AccessRisk token={currencies.output} />
                      )}
                    </Box>
                    <LimitOrderPrice
                      id="limit-order-desired-rate-input"
                      value={formattedAmounts.price}
                      onUserInput={handleTypeDesiredRate}
                      inputCurrency={currencies.input}
                      outputCurrency={currencies.output}
                      percentageRateDifference={percentageRateDifference}
                      rateType={rateType}
                      handleRateType={handleRateType}
                      price={price}
                      handleResetToMarketPrice={handleResetToMarketPrice}
                      realExecutionPriceAsString={!inputError ? realExecutionPriceAsString : undefined}
                      disabled={!formattedAmounts.input && !formattedAmounts.output}
                    />
                  </AutoColumn>
                  <Box mt="0.25rem">
                    {!account ? (
                      <ConnectWalletButton width="100%" />
                    ) : showApproveFlow ? (
                      <Button
                        variant="primary"
                        onClick={handleApprove}
                        id="enable-order-button"
                        width="100%"
                        disabled={approvalSubmitted}
                      >
                        {approvalSubmitted
                          ? t('Enabling %asset%', { asset: currencies.input?.symbol })
                          : t('Enable %asset%', { asset: currencies.input?.symbol })}
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={() => {
                          setSwapState({
                            tradeToConfirm: trade,
                            attemptingTxn: false,
                            swapErrorMessage: undefined,
                            txHash: undefined,
                          })
                          showConfirmModal()
                        }}
                        id="place-order-button"
                        width="100%"
                        disabled={!!inputError || realExecutionPriceAsString === 'never executes'}
                      >
                        {inputError || realExecutionPriceAsString === 'never executes'
                          ? inputError || t("Can't execute this order")
                          : t('Place an Order')}
                      </Button>
                    )}
                  </Box>
                  <Flex mt="16px" justifyContent="center">
                    <Link external href="https://www.gelato.network/">
                      <img
                        src={
                          theme.isDark ? '/images/powered_by_gelato_white.svg' : '/images/powered_by_gelato_black.svg'
                        }
                        alt="Powered by Gelato"
                        width="170px"
                        height="48px"
                      />
                    </Link>
                  </Flex>
                </Wrapper>
              </AppBody>
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
          {!isDesktop && (
            <Flex mt="24px" width="100%">
              <LimitOrderTable isCompact />
            </Flex>
          )}
          {isSideFooter && (
            <Box display={['none', null, null, 'block']} width="100%" height="100%">
              <SwapUI.Footer variant="side" helpUrl={LIMIT_ORDERS_DOCS_URL} />
            </Box>
          )}
        </Flex>
      </Flex>
      {/* Fixed position, doesn't take normal DOM space */}
      <BottomDrawer
        content={
          <PriceChartContainer
            inputCurrency={currencies.input}
            outputCurrency={currencies.output}
            isChartExpanded={isChartExpanded}
            setIsChartExpanded={setIsChartExpanded}
            isChartDisplayed={isChartDisplayed}
            currentSwapPrice={singleTokenPrice}
            isFullWidthContainer
            isMobile
          />
        }
        isOpen={isChartDisplayed}
        setIsOpen={setIsChartDisplayed}
      />
    </Page>
  )
}

export default LimitOrders
