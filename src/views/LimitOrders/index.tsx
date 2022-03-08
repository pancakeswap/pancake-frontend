import { useCallback, useEffect, useState } from 'react'
import { CurrencyAmount, Token, Trade } from '@pancakeswap/sdk'
import { Button, Box, Flex, useModal, useMatchBreakpoints, BottomDrawer, Link } from '@pancakeswap/uikit'

import { useTranslation } from 'contexts/Localization'
import { AutoColumn } from 'components/Layout/Column'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { AppBody } from 'components/App'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Footer from 'components/Menu/Footer'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useGelatoLimitOrders from 'hooks/limitOrders/useGelatoLimitOrders'
import useGasOverhead from 'hooks/limitOrders/useGasOverhead'
import useTheme from 'hooks/useTheme'
import { ApprovalState, useApproveCallbackFromInputCurrencyAmount } from 'hooks/useApproveCallback'
import { Field } from 'state/limitOrders/types'
import { useDefaultsFromURLSearch } from 'state/limitOrders/hooks'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { GELATO_NATIVE, LIMIT_ORDERS_DOCS_URL } from 'config/constants'
import { useExchangeChartManager } from 'state/user/hooks'
import PriceChartContainer from 'views/Swap/components/Chart/PriceChartContainer'

import { Wrapper, StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'
import CurrencyInputHeader from './components/CurrencyInputHeader'
import LimitOrderPrice from './components/LimitOrderPrice'
import SwitchTokensButton from './components/SwitchTokensButton'
import Page from '../Page'
import LimitOrderTable from './components/LimitOrderTable'
import { ConfirmLimitOrderModal } from './components/ConfirmLimitOrderModal'
import getRatePercentageDifference from './utils/getRatePercentageDifference'

const LimitOrders = () => {
  // Helpers
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { theme } = useTheme()
  const [userChartPreference, setUserChartPreference] = useExchangeChartManager(isMobile)
  const [isChartExpanded, setIsChartExpanded] = useState(false)
  const [isChartDisplayed, setIsChartDisplayed] = useState(userChartPreference)

  useEffect(() => {
    setUserChartPreference(isChartDisplayed)
  }, [isChartDisplayed, setUserChartPreference])

  // TODO: use returned loadedUrlParams for warnings
  useDefaultsFromURLSearch()

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
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const [approvalState, approveCallback] = useApproveCallbackFromInputCurrencyAmount(parsedAmounts.input)

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances.input)
  const hideMaxButton = Boolean(maxAmountInput && parsedAmounts.input?.equalTo(maxAmountInput))

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
    (inputCurrency) => {
      setApprovalSubmitted(false)
      handleCurrencySelection(Field.INPUT, inputCurrency)
    },
    [handleCurrencySelection],
  )
  const handleTypeDesiredRate = useCallback(
    (value: string) => {
      handleInput(Field.PRICE, value)
    },
    [handleInput],
  )
  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      handleInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, handleInput])
  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      handleCurrencySelection(Field.OUTPUT, outputCurrency)
    },
    [handleCurrencySelection],
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
      const inputToken = currencies.input instanceof Token ? wrappedCurrencies.input?.address : GELATO_NATIVE
      const outputToken = currencies.output instanceof Token ? wrappedCurrencies.output?.address : GELATO_NATIVE

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

  const { realExecutionPriceAsString } = useGasOverhead(parsedAmounts.input, parsedAmounts.output, rateType)

  const [showConfirmModal] = useModal(
    <ConfirmLimitOrderModal
      currencies={currencies}
      formattedAmounts={formattedAmounts}
      currentMarketRate={currentMarketRate?.toSignificant(4)}
      currentMarketRateInverted={currentMarketRate?.invert().toSignificant(4)}
      limitPrice={formattedAmounts.price}
      limitPriceInverted={price?.invert().toSignificant(6)}
      percentageRateDifference={parseFloat(percentageRateDifference?.toSignificant(3)).toLocaleString(undefined, {
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

  return (
    <Page
      removePadding={isChartExpanded}
      hideFooterOnDesktop={isSideFooter}
      noMinHeight
      helpUrl={LIMIT_ORDERS_DOCS_URL}
    >
      <Flex
        width="100%"
        justifyContent="center"
        position="relative"
        mb={isSideFooter ? null : '24px'}
        mt={isChartExpanded ? '24px' : null}
      >
        {!isMobile && (
          <Flex width={isChartExpanded ? '100%' : '50%'} flexDirection="column">
            <PriceChartContainer
              inputCurrencyId={currencyIds.input}
              inputCurrency={currencies.input}
              outputCurrencyId={currencyIds.output}
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
                      showMaxButton={!hideMaxButton}
                      currency={currencies.input}
                      onUserInput={handleTypeInput}
                      onMax={handleMaxInput}
                      onCurrencySelect={handleInputSelect}
                      otherCurrency={currencies.output}
                      id="limit-order-currency-input"
                    />

                    <SwitchTokensButton
                      handleSwitchTokens={() => {
                        setApprovalSubmitted(false)
                        handleSwitchTokens()
                      }}
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
                    />
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
          {isMobile && (
            <Flex mt="24px" width="100%">
              <LimitOrderTable isCompact />
            </Flex>
          )}
          {isSideFooter && (
            <Box display={['none', null, null, 'block']} width="100%" height="100%">
              <Footer variant="side" helpUrl={LIMIT_ORDERS_DOCS_URL} />
            </Box>
          )}
        </Flex>
      </Flex>
      {/* Fixed position, doesn't take normal DOM space */}
      <BottomDrawer
        content={
          <PriceChartContainer
            inputCurrencyId={currencyIds.input}
            inputCurrency={currencies[Field.INPUT]}
            outputCurrencyId={currencyIds.output}
            outputCurrency={currencies[Field.OUTPUT]}
            isChartExpanded={isChartExpanded}
            setIsChartExpanded={setIsChartExpanded}
            isChartDisplayed={isChartDisplayed}
            currentSwapPrice={singleTokenPrice}
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
