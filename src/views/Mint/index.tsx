import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { CurrencyAmount, Token, Trade } from 'peronio-sdk'
import {
  Button,
  Text,
  ArrowDownIcon,
  Box,
  useModal,
  Flex,
  IconButton,
  ArrowUpDownIcon,
  // BottomDrawer,
  // useMatchBreakpoints,
  // ArrowUpDownIcon,
} from 'peronio-uikit'
// import Footer from 'components/Menu/Footer'
import { RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
// import SwapWarningTokens from 'config/constants/swapWarningTokens'
import AddressInputPanel from './components/AddressInputPanel'
import Column, { AutoColumn } from '../../components/Layout/Column'
import ConfirmMintModal from './components/ConfirmMintModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { AutoRow, RowBetween } from '../../components/Layout/Row'
import AdvancedSwapDetailsDropdown from './components/AdvancedSwapDetailsDropdown'
import { ArrowWrapper, MintCallbackError, Wrapper } from './components/styleds'
import TradePrice from './components/TradePrice'
import ImportTokenWarningModal from './components/ImportTokenWarningModal'
import ProgressSteps from './components/ProgressSteps'
import { AppBody } from '../../components/App'
import ConnectWalletButton from '../../components/ConnectWalletButton'

import { INITIAL_ALLOWED_SLIPPAGE } from '../../config/constants'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useCurrency, useAllTokens } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import { Field } from '../../state/swap/actions'
import {
  useDefaultsFromURLSearch,
  useSwapActionHandlers,
  useSwapState,
  useDerivedSwapInfo,
} from '../../state/swap/hooks'
import { useMintTokenInfo } from '../../state/tokenMint/hooks'

import {
  useExpertModeManager,
  useUserSlippageTolerance,
  // useExchangeChartManager,
} from '../../state/user/hooks'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import CircleLoader from '../../components/Loader/CircleLoader'
import Page from '../Page'
// import SwapWarningModal from './components/SwapWarningModal'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'
import CurrencyInputHeader from './components/CurrencyInputHeader'

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

export default function Mint({ history }: RouteComponentProps) {
  const loadedUrlParams = useDefaultsFromURLSearch()
  const { t } = useTranslation()
  // const { isMobile } = useMatchBreakpoints();

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  )

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens()
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !(token.address in defaultTokens)
    })

  const { account } = useActiveWeb3React()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const { v2Trade } = useDerivedSwapInfo()
  const { mint, parsedAmount, currencies, currencyBalances, inputError: swapInputError } = useMintTokenInfo()

  const trade = v2Trade

  // const singleTokenPrice = useSingleTokenSwapInfo()

  const parsedAmounts = {
    [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : mint?.inputAmount,
    [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : mint?.outputAmount,
  }

  const { onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
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

  // modal and loading
  const [{ mintToConfirm, mintErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    mintToConfirm: Trade | undefined
    attemptingTxn: boolean
    mintErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    mintToConfirm: undefined,
    attemptingTxn: false,
    mintErrorMessage: undefined,
    txHash: undefined,
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)

  const handleSwap = useCallback(() => {
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, mintToConfirm, mintErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, mintToConfirm, mintErrorMessage: undefined, txHash: hash })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          mintToConfirm,
          mintErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [swapCallback, mintToConfirm])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const priceImpactSeverity = 0

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ mintToConfirm, attemptingTxn, mintErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, mintErrorMessage, mintToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ mintToConfirm: trade, mintErrorMessage, txHash, attemptingTxn })
  }, [attemptingTxn, mintErrorMessage, trade, txHash])

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const [onPresentImportTokenWarningModal] = useModal(
    <ImportTokenWarningModal tokens={importTokensNotInDefault} onCancel={() => history.push('/mint')} />,
  )

  useEffect(() => {
    if (importTokensNotInDefault.length > 0) {
      onPresentImportTokenWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importTokensNotInDefault.length])

  const [onPresentConfirmModal] = useModal(
    <ConfirmMintModal
      trade={trade}
      originalTrade={mintToConfirm}
      onAcceptChanges={handleAcceptChanges}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      recipient={recipient}
      allowedSlippage={allowedSlippage}
      onConfirm={handleSwap}
      mintErrorMessage={mintErrorMessage}
      customOnDismiss={handleConfirmDismiss}
    />,
    true,
    true,
    'confirmMintModal',
  )

  return (
    <Page removePadding={false} hideFooterOnDesktop={false}>
      <Flex width="100%" justifyContent="center" position="relative">
        <Flex flexDirection="column">
          <StyledSwapContainer $isChartExpanded={false}>
            <StyledInputCurrencyWrapper mt="0">
              <AppBody>
                <CurrencyInputHeader
                  title={t('Mint')}
                  subtitle={t('Deposit USDT to mint PE tokens')}
                  setIsChartDisplayed={null}
                  isChartDisplayed={false}
                />
                <Wrapper id="swap-page">
                  <AutoColumn gap="md">
                    <CurrencyInputPanel
                      label={independentField === Field.OUTPUT && trade ? t('From (estimated)') : t('From')}
                      value={formattedAmounts[Field.INPUT]}
                      showMaxButton={!atMaxAmountInput}
                      currency={currencies[Field.INPUT]}
                      onUserInput={handleTypeInput}
                      onMax={handleMaxInput}
                      onCurrencySelect={null}
                      otherCurrency={currencies[Field.OUTPUT]}
                      id="swap-currency-input"
                      disableCurrencySelect
                    />

                    <AutoColumn justify="space-between">
                      <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
                        <SwitchIconButton
                          variant="light"
                          scale="sm"
                          onClick={() => {
                            history.push('/withdraw')
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
                        {recipient === null && isExpertMode ? (
                          <Button variant="text" id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                            {t('+ Add a send (optional)')}
                          </Button>
                        ) : null}
                      </AutoRow>
                    </AutoColumn>
                    <CurrencyInputPanel
                      value={formattedAmounts[Field.OUTPUT]}
                      onUserInput={handleTypeOutput}
                      label={independentField === Field.INPUT && trade ? t('To (estimated)') : t('To')}
                      showMaxButton={false}
                      currency={currencies[Field.OUTPUT]}
                      onCurrencySelect={null}
                      otherCurrency={currencies[Field.INPUT]}
                      id="swap-currency-output"
                      disableCurrencySelect
                    />

                    {isExpertMode && recipient !== null ? (
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

                    <AutoColumn gap="8px" style={{ padding: '0 16px' }}>
                      {Boolean(trade) && (
                        <RowBetween align="center">
                          <Label>{t('Price')}</Label>
                          <TradePrice
                            price={trade?.executionPrice}
                            showInverted={showInverted}
                            setShowInverted={setShowInverted}
                          />
                        </RowBetween>
                      )}
                      {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                        <RowBetween align="center">
                          <Label>{t('Slippage Tolerance')}</Label>
                          <Text bold color="primary">
                            {allowedSlippage / 100}%
                          </Text>
                        </RowBetween>
                      )}
                    </AutoColumn>
                  </AutoColumn>
                  <Box mt="1rem">
                    {!account ? (
                      <ConnectWalletButton width="100%" />
                    ) : showApproveFlow ? (
                      <RowBetween>
                        <Button
                          variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
                          onClick={approveCallback}
                          disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                          width="48%"
                        >
                          {approval === ApprovalState.PENDING ? (
                            <AutoRow gap="6px" justify="center">
                              {t('Enabling')} <CircleLoader stroke="white" />
                            </AutoRow>
                          ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                            t('Enabled')
                          ) : (
                            t('Enable %asset%', { asset: currencies[Field.INPUT]?.symbol ?? '' })
                          )}
                        </Button>
                        <Button
                          variant={isValid && priceImpactSeverity > 2 ? 'danger' : 'primary'}
                          onClick={() => {
                            if (isExpertMode) {
                              handleSwap()
                            } else {
                              setSwapState({
                                mintToConfirm: trade,
                                attemptingTxn: false,
                                mintErrorMessage: undefined,
                                txHash: undefined,
                              })
                              onPresentConfirmModal()
                            }
                          }}
                          width="48%"
                          id="swap-button"
                          disabled={
                            !isValid ||
                            approval !== ApprovalState.APPROVED ||
                            (priceImpactSeverity > 3 && !isExpertMode)
                          }
                        >
                          {t('Mint')}
                        </Button>
                      </RowBetween>
                    ) : (
                      <Button
                        variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'primary'}
                        onClick={() => {
                          if (isExpertMode) {
                            handleSwap()
                          } else {
                            setSwapState({
                              mintToConfirm: trade,
                              attemptingTxn: false,
                              mintErrorMessage: undefined,
                              txHash: undefined,
                            })
                            onPresentConfirmModal()
                          }
                        }}
                        id="swap-button"
                        width="100%"
                        disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                      >
                        {swapInputError ||
                          (priceImpactSeverity > 3 && !isExpertMode
                            ? t('Price Impact Too High')
                            : priceImpactSeverity > 2
                            ? t('Mint Anyway')
                            : t('Mint'))}
                      </Button>
                    )}
                    {showApproveFlow && (
                      <Column style={{ marginTop: '1rem' }}>
                        <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                      </Column>
                    )}
                    {isExpertMode && mintErrorMessage ? <MintCallbackError error={mintErrorMessage} /> : null}
                  </Box>
                </Wrapper>
              </AppBody>
              {trade && <AdvancedSwapDetailsDropdown trade={trade} />}
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
        </Flex>
      </Flex>
    </Page>
  )
}
