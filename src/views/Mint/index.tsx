import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { CurrencyAmount, Trade } from 'peronio-sdk'
import { Button, Text, ArrowDownIcon, Box, useModal, Flex, IconButton, ArrowUpDownIcon } from 'peronio-uikit'
// import Footer from 'components/Menu/Footer'
import { RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import { useMintCallback } from 'hooks/useMintCallback'
import AddressInputPanel from './components/AddressInputPanel'
import Column, { AutoColumn } from '../../components/Layout/Column'
import ConfirmMintModal from './components/ConfirmMintModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { AutoRow, RowBetween } from '../../components/Layout/Row'
import AdvancedMintDetailsDropdown from './components/AdvancedMintDetailsDropdown'
import { ArrowWrapper, MintCallbackError, Wrapper } from './components/styleds'
import MintPrice from './components/MintPrice'
import ProgressSteps from './components/ProgressSteps'
import { AppBody } from '../../components/App'
import ConnectWalletButton from '../../components/ConnectWalletButton'

import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { ApprovalState, useApproveCallbackFromMint } from '../../hooks/useApproveCallback'
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
  useDefaultsFromURLSearch()
  const { t } = useTranslation()

  const { account } = useActiveWeb3React()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const { v2Trade } = useDerivedSwapInfo()
  const { mint, parsedAmount, currencies, currencyBalances, inputError: swapInputError } = useMintTokenInfo()

  const trade = v2Trade

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
  const [{ mintToConfirm, mintErrorMessage, attemptingTxn, txHash }, setMintState] = useState<{
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
  const [approval, approveCallback] = useApproveCallbackFromMint(mint)

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
  const { callback: mintCallback, error: swapCallbackError } = useMintCallback(mint, recipient)

  const handleSwap = useCallback(() => {
    if (!mintCallback) {
      return
    }
    setMintState({ attemptingTxn: true, mintToConfirm, mintErrorMessage: undefined, txHash: undefined })
    mintCallback()
      .then((hash) => {
        setMintState({ attemptingTxn: false, mintToConfirm, mintErrorMessage: undefined, txHash: hash })
      })
      .catch((error) => {
        setMintState({
          attemptingTxn: false,
          mintToConfirm,
          mintErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [mintCallback, mintToConfirm])

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
    setMintState({ mintToConfirm, attemptingTxn, mintErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, mintErrorMessage, mintToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setMintState({ mintToConfirm: trade, mintErrorMessage, txHash, attemptingTxn })
  }, [attemptingTxn, mintErrorMessage, trade, txHash])

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const [onPresentConfirmModal] = useModal(
    <ConfirmMintModal
      trade={trade}
      originalTrade={mintToConfirm}
      onAcceptChanges={handleAcceptChanges}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      recipient={recipient}
      allowedSlippage={0}
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
                      label={independentField === Field.OUTPUT && mint ? t('From (estimated)') : t('From')}
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
                      label={independentField === Field.INPUT && mint ? t('To (estimated)') : t('To')}
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
                      {Boolean(mint) && (
                        <RowBetween align="center">
                          <Label>{t('Price')}</Label>
                          <MintPrice
                            price={mint?.executionPrice}
                            showInverted={showInverted}
                            setShowInverted={setShowInverted}
                          />
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
                              setMintState({
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
                            setMintState({
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
              {trade && <AdvancedMintDetailsDropdown mint={mint} />}
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
        </Flex>
      </Flex>
    </Page>
  )
}
