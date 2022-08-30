import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ChainId, Currency, CurrencyAmount } from '@pancakeswap/sdk'
import {
  Button,
  Text,
  ArrowDownIcon,
  Box,
  Flex,
  IconButton,
  BottomDrawer,
  ArrowUpDownIcon,
  Skeleton,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import UnsupportedCurrencyFooter from 'components/UnsupportedCurrencyFooter'
import Footer from 'components/Menu/Footer'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from '@pancakeswap/localization'
import { EXCHANGE_DOCS_URLS } from 'config/constants'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'

import useRefreshBlockNumberID from './hooks/useRefreshBlockNumber'
import AddressInputPanel from './components/AddressInputPanel'
import { AutoColumn } from '../../components/Layout/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { AutoRow, RowBetween } from '../../components/Layout/Row'
import AdvancedSwapDetailsDropdown from './components/AdvancedSwapDetailsDropdown'
import { ArrowWrapper, Wrapper } from './components/styleds'
import TradePrice from './components/TradePrice'
import { AppBody } from '../../components/App'

import { useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { Field } from '../../state/swap/actions'
import { useDerivedSwapInfo, useSwapState, useSingleTokenSwapInfo } from '../../state/swap/hooks'
import { useExpertModeManager, useUserSlippageTolerance, useExchangeChartManager } from '../../state/user/hooks'
import Page from '../Page'
import PriceChartContainer from './components/Chart/PriceChartContainer'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'
import CurrencyInputHeader from './components/CurrencyInputHeader'
import { CommonBasesType } from '../../components/SearchModal/types'
import replaceBrowserHistory from '../../utils/replaceBrowserHistory'
import { currencyId } from '../../utils/currencyId'
import SwapCommitButton from './components/SwapCommitButton'
import useWarningImport from './hooks/useWarningImport'

const Label = styled(Text)`
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
`

const SwitchIconButton = styled(IconButton)`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  .icon-up-down {
    display: none;
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    .icon-down {
      display: none;
      fill: white;
    }
    .icon-up-down {
      display: block;
      fill: white;
    }
  }
`

const CHART_SUPPORT_CHAIN_IDS = [ChainId.BSC]

export default function Swap() {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const [isChartExpanded, setIsChartExpanded] = useState(false)
  const [userChartPreference, setUserChartPreference] = useExchangeChartManager(isMobile)
  const [isChartDisplayed, setIsChartDisplayed] = useState(userChartPreference)
  const { refreshBlockNumber, isLoading } = useRefreshBlockNumberID()
  const warningSwapHandler = useWarningImport()

  useEffect(() => {
    setUserChartPreference(isChartDisplayed)
  }, [isChartDisplayed, setUserChartPreference])

  const { account, chainId } = useActiveWeb3React()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state & price data
  const {
    independentField,
    typedValue,
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const {
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo(independentField, typedValue, inputCurrency, outputCurrency, recipient)

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade

  const singleTokenPrice = useSingleTokenSwapInfo(inputCurrencyId, inputCurrency, outputCurrencyId, outputCurrency)

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()

  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput],
  )

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage, chainId)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount<Currency> | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  const handleInputSelect = useCallback(
    (currencyInput) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, currencyInput)

      warningSwapHandler(currencyInput)

      replaceBrowserHistory('inputCurrency', currencyId(currencyInput))
    },
    [onCurrencySelection, warningSwapHandler],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(
    (currencyOutput) => {
      onCurrencySelection(Field.OUTPUT, currencyOutput)
      warningSwapHandler(currencyOutput)

      replaceBrowserHistory('outputCurrency', currencyId(currencyOutput))
    },

    [onCurrencySelection, warningSwapHandler],
  )

  const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  const hasAmount = Boolean(parsedAmount)

  const onRefreshPrice = useCallback(() => {
    if (hasAmount) {
      refreshBlockNumber()
    }
  }, [hasAmount, refreshBlockNumber])

  const isChartSupported = useMemo(
    () =>
      // avoid layout shift, by default showing
      !chainId || CHART_SUPPORT_CHAIN_IDS.includes(chainId),
    [chainId],
  )

  return (
    <Page removePadding={isChartExpanded} hideFooterOnDesktop={isChartExpanded}>
      <Flex width="100%" justifyContent="center" position="relative">
        {!isMobile && isChartSupported && (
          <PriceChartContainer
            inputCurrencyId={inputCurrencyId}
            inputCurrency={currencies[Field.INPUT]}
            outputCurrencyId={outputCurrencyId}
            outputCurrency={currencies[Field.OUTPUT]}
            isChartExpanded={isChartExpanded}
            setIsChartExpanded={setIsChartExpanded}
            isChartDisplayed={isChartDisplayed}
            currentSwapPrice={singleTokenPrice}
          />
        )}
        {isChartSupported && (
          <BottomDrawer
            content={
              <PriceChartContainer
                inputCurrencyId={inputCurrencyId}
                inputCurrency={currencies[Field.INPUT]}
                outputCurrencyId={outputCurrencyId}
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
        )}
        <Flex flexDirection="column">
          <StyledSwapContainer $isChartExpanded={isChartExpanded}>
            <StyledInputCurrencyWrapper mt={isChartExpanded ? '24px' : '0'}>
              <AppBody>
                <CurrencyInputHeader
                  title={t('Swap')}
                  subtitle={t('Trade tokens in an instant')}
                  setIsChartDisplayed={setIsChartDisplayed}
                  isChartDisplayed={isChartDisplayed}
                  hasAmount={hasAmount}
                  onRefreshPrice={onRefreshPrice}
                />
                <Wrapper id="swap-page" style={{ minHeight: '412px' }}>
                  <AutoColumn gap="sm">
                    <CurrencyInputPanel
                      label={
                        independentField === Field.OUTPUT && !showWrap && trade ? t('From (estimated)') : t('From')
                      }
                      value={formattedAmounts[Field.INPUT]}
                      showMaxButton={!atMaxAmountInput}
                      currency={currencies[Field.INPUT]}
                      onUserInput={handleTypeInput}
                      onMax={handleMaxInput}
                      onCurrencySelect={handleInputSelect}
                      otherCurrency={currencies[Field.OUTPUT]}
                      id="swap-currency-input"
                      showCommonBases
                      commonBasesType={CommonBasesType.SWAP_LIMITORDER}
                    />

                    <AutoColumn justify="space-between">
                      <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
                        <SwitchIconButton
                          variant="light"
                          scale="sm"
                          onClick={() => {
                            setApprovalSubmitted(false) // reset 2 step UI for approvals
                            onSwitchTokens()
                          }}
                        >
                          <ArrowDownIcon
                            className="icon-down"
                            color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? 'primary' : 'text'}
                          />
                          <ArrowUpDownIcon
                            className="icon-up-down"
                            color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? 'primary' : 'text'}
                          />
                        </SwitchIconButton>
                        {recipient === null && !showWrap && isExpertMode ? (
                          <Button variant="text" id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                            {t('+ Add a send (optional)')}
                          </Button>
                        ) : null}
                      </AutoRow>
                    </AutoColumn>
                    <CurrencyInputPanel
                      value={formattedAmounts[Field.OUTPUT]}
                      onUserInput={handleTypeOutput}
                      label={independentField === Field.INPUT && !showWrap && trade ? t('To (estimated)') : t('To')}
                      showMaxButton={false}
                      currency={currencies[Field.OUTPUT]}
                      onCurrencySelect={handleOutputSelect}
                      otherCurrency={currencies[Field.INPUT]}
                      id="swap-currency-output"
                      showCommonBases
                      commonBasesType={CommonBasesType.SWAP_LIMITORDER}
                    />

                    {isExpertMode && recipient !== null && !showWrap ? (
                      <>
                        <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                          <ArrowWrapper clickable={false}>
                            <ArrowDownIcon width="16px" />
                          </ArrowWrapper>
                          <Button variant="text" id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                            {t('- Remove send')}
                          </Button>
                        </AutoRow>
                        <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                      </>
                    ) : null}

                    {showWrap ? null : (
                      <AutoColumn gap="7px" style={{ padding: '0 16px' }}>
                        <RowBetween align="center">
                          {Boolean(trade) && (
                            <>
                              <Label>{t('Price')}</Label>
                              {isLoading ? (
                                <Skeleton width="100%" ml="8px" height="24px" />
                              ) : (
                                <TradePrice
                                  price={trade?.executionPrice}
                                  showInverted={showInverted}
                                  setShowInverted={setShowInverted}
                                />
                              )}
                            </>
                          )}
                        </RowBetween>
                        <RowBetween align="center">
                          <Label>{t('Slippage Tolerance')}</Label>
                          <Text bold color="primary">
                            {allowedSlippage / 100}%
                          </Text>
                        </RowBetween>
                      </AutoColumn>
                    )}
                  </AutoColumn>
                  <Box mt="0.25rem">
                    <SwapCommitButton
                      swapIsUnsupported={swapIsUnsupported}
                      account={account}
                      showWrap={showWrap}
                      wrapInputError={wrapInputError}
                      onWrap={onWrap}
                      wrapType={wrapType}
                      parsedIndepentFieldAmount={parsedAmounts[independentField]}
                      approval={approval}
                      approveCallback={approveCallback}
                      approvalSubmitted={approvalSubmitted}
                      currencies={currencies}
                      isExpertMode={isExpertMode}
                      trade={trade}
                      swapInputError={swapInputError}
                      currencyBalances={currencyBalances}
                      recipient={recipient}
                      allowedSlippage={allowedSlippage}
                      onUserInput={onUserInput}
                    />
                  </Box>
                </Wrapper>
              </AppBody>
              {!swapIsUnsupported ? (
                trade && <AdvancedSwapDetailsDropdown trade={trade} />
              ) : (
                <UnsupportedCurrencyFooter currencies={[currencies.INPUT, currencies.OUTPUT]} />
              )}
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
          {isChartExpanded && (
            <Box display={['none', null, null, 'block']} width="100%" height="100%">
              <Footer variant="side" helpUrl={EXCHANGE_DOCS_URLS} />
            </Box>
          )}
        </Flex>
      </Flex>
    </Page>
  )
}
