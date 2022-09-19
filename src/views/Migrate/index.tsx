import React, { useCallback, useEffect, useState } from 'react'
import { parseUnits } from '@ethersproject/units'

import { CurrencyAmount, JSBI, Mint, TokenAmount } from 'peronio-sdk'
import { Button, ArrowDownIcon, Box, useModal, Flex } from 'peronio-uikit'
import { RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import { useMigrateTokenInfo } from 'state/tokenMigrate/hooks'
import { useMigratorContract } from 'hooks/useContract'
import { debounce } from 'lodash'
import { tryParseAmount } from 'state/swap/hooks'
import { mainnetTokens } from 'config/constants/tokens'
import { useCurrency } from 'hooks/Tokens'
import Column, { AutoColumn } from '../../components/Layout/Column'
import ConfirmMintModal from './components/ConfirmMintModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { AutoRow, RowBetween } from '../../components/Layout/Row'
import { Wrapper } from './components/styleds'
import ProgressSteps from './components/ProgressSteps'
import { AppBody } from '../../components/App'
import ConnectWalletButton from '../../components/ConnectWalletButton'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { ApprovalState, useApproveCallbackFromMigrate } from '../../hooks/useApproveCallback'
import { Field } from '../../state/tokenMigrate/actions'
import { useDefaultsFromURLSearch, useSwapState } from '../../state/swap/hooks'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import CircleLoader from '../../components/Loader/CircleLoader'
import Page from '../Page'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'
import CurrencyInputHeader from './components/CurrencyInputHeader'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function MigrateView(props: RouteComponentProps) {
  useDefaultsFromURLSearch()
  const { t } = useTranslation()

  const { account } = useActiveWeb3React()

  // for expert mode
  const migratorContract = useMigratorContract()

  // swap state
  const { recipient } = useSwapState()
  const { mint, currencies, currencyBalances } = useMigrateTokenInfo()
  const [migrate, setMigrate] = useState<any>()
  // const [mint, setMint] = useState({ inputAmount: 0, outputAmount: 0 })
  const [inputValue, setInputValue] = useState<string>('0.0')
  const [inputAmount, setInputAmount] = useState<CurrencyAmount | undefined>()
  const [outputAmount, setOutputAmount] = useState<CurrencyAmount | undefined>()
  const [outputUSDCString, setOutputUSDCString] = useState<string>('0.0')

  const parsedAmounts = {
    [Field.INPUT]: inputAmount,
    [Field.OUTPUT]: migrate?.outputAmount,
  }

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [currencyBalances[Field.INPUT], inputAmount]
  let inputError = null
  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = t('Insufficient %symbol% balance', { symbol: amountIn.currency.symbol })
  }

  const isValid = inputError == null

  const inputCurrencyId = mainnetTokens.pV1.address
  const inputCurrency = useCurrency(inputCurrencyId)

  const calculateOutput = debounce((value) => {
    if (!value) {
      return
    }
    const theAmmount = parseUnits(value, inputCurrency.decimals)

    migratorContract.quote(theAmmount.toNumber()).then((resultado: React.SetStateAction<string>) => {
      const parsedOutputAmount = new TokenAmount(mainnetTokens.pe, JSBI.BigInt(resultado[1]))
      const parsedIntermediateAmount = new TokenAmount(mainnetTokens.pe, JSBI.BigInt(resultado[0]))
      setOutputAmount(parsedOutputAmount)
      setOutputUSDCString(parsedIntermediateAmount.toSignificant())
    })
  }, 10)

  const handleTypeInput = useCallback(
    (value: string) => {
      if (value === undefined) return
      setInputValue(value)
      const parsedInputAmount = tryParseAmount(value, inputCurrency)
      setInputAmount(parsedInputAmount)
      calculateOutput(value)
      // onUserInput(Field.INPUT, value)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      return value
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  // modal and loading
  const [{ mintToConfirm, mintErrorMessage, attemptingTxn, txHash }, setMintState] = useState<{
    mintToConfirm: Mint | undefined
    attemptingTxn: boolean
    mintErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    mintToConfirm: undefined,
    attemptingTxn: false,
    mintErrorMessage: undefined,
    txHash: undefined,
  })

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromMigrate(migrate)
  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING || approval === ApprovalState.APPROVED) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  // const { callback: mintCallback, error: swapCallbackError } = useMintCallback(migrate, recipient)

  const migrateCallback = useCallback(() => {
    const theAmmount = parseUnits(inputAmount.toExact(), inputCurrency.decimals)

    migratorContract
      .migrate(theAmmount)
      .then(() => {
        setMintState({ attemptingTxn: false, mintToConfirm: undefined, mintErrorMessage: undefined, txHash: undefined })
      })
      .catch((error) => {
        setMintState({
          attemptingTxn: false,
          mintToConfirm,
          mintErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [inputAmount, inputCurrency.decimals, migratorContract, mintToConfirm])

  const handleSwap = useCallback(() => {
    setMintState({ attemptingTxn: true, mintToConfirm, mintErrorMessage: undefined, txHash: undefined })
    migrateCallback()
  }, [migrateCallback, mintToConfirm])

  // errors
  // warnings on slippage
  const priceImpactSeverity = 0

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !inputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED))

  const handleConfirmDismiss = useCallback(() => {
    setMintState({ mintToConfirm, attemptingTxn, mintErrorMessage, txHash })
    if (txHash) {
      handleTypeInput('0.0')
    }
    // if there was a tx hash, we want to clear the input
  }, [attemptingTxn, handleTypeInput, mintErrorMessage, mintToConfirm, txHash])

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      handleTypeInput(maxAmountInput.toExact())
    }
  }, [handleTypeInput, maxAmountInput])

  useEffect(() => {
    setMigrate({
      inputAmount,
      outputAmount,
    })
  }, [inputAmount, outputAmount])
  const [onPresentConfirmModal, onDismissModal] = useModal(
    <ConfirmMintModal
      mint={migrate}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      recipient={recipient}
      onConfirm={handleSwap}
      mintErrorMessage={mintErrorMessage}
      customOnDismiss={handleConfirmDismiss}
    />,
    true,
    true,
    'confirmMintModal',
  )

  const formattedAmounts = {
    [Field.INPUT]: inputValue,
    [Field.INTERMEDIATE]: outputUSDCString,
    [Field.OUTPUT]: outputAmount?.toSignificant(6) ?? '',
  }

  return (
    <Page removePadding={false} hideFooterOnDesktop={false}>
      <Flex width="100%" justifyContent="center" position="relative">
        <Flex flexDirection="column">
          <StyledSwapContainer $isChartExpanded={false}>
            <StyledInputCurrencyWrapper mt="0">
              <AppBody>
                <CurrencyInputHeader
                  title={t('Migrate')}
                  subtitle={t('Migrate PE tokens to PE2 tokens')}
                  setIsChartDisplayed={null}
                  isChartDisplayed={false}
                />
                <Wrapper id="swap-page">
                  <AutoColumn gap="md">
                    <CurrencyInputPanel
                      label={t('From')}
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
                      <AutoRow justify="center" style={{ padding: '0 1rem' }}>
                        <ArrowDownIcon
                          className="icon-down"
                          color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? 'primary' : 'text'}
                        />
                      </AutoRow>
                    </AutoColumn>
                    <CurrencyInputPanel
                      value={formattedAmounts[Field.INTERMEDIATE]}
                      onUserInput={handleTypeOutput}
                      label={t('To (estimated)')}
                      showMaxButton={false}
                      currency={currencies[Field.INTERMEDIATE]}
                      onCurrencySelect={null}
                      otherCurrency={currencies[Field.INTERMEDIATE]}
                      id="swap-currency-output"
                      disabled
                      disableCurrencySelect
                    />
                    <AutoColumn justify="space-between">
                      <AutoRow justify="center" style={{ padding: '0 1rem' }}>
                        <ArrowDownIcon
                          className="icon-down"
                          color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? 'primary' : 'text'}
                        />
                      </AutoRow>
                    </AutoColumn>
                    <CurrencyInputPanel
                      value={formattedAmounts[Field.OUTPUT]}
                      onUserInput={handleTypeOutput}
                      label={t('To (estimated)')}
                      showMaxButton={false}
                      currency={currencies[Field.OUTPUT]}
                      onCurrencySelect={null}
                      otherCurrency={currencies[Field.INPUT]}
                      id="swap-currency-output"
                      disabled
                      disableCurrencySelect
                    />
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
                            setMintState({
                              mintToConfirm: migrate,
                              attemptingTxn: false,
                              mintErrorMessage: undefined,
                              txHash: undefined,
                            })
                            onPresentConfirmModal()
                          }}
                          width="48%"
                          id="swap-button"
                          disabled={!isValid || approval !== ApprovalState.APPROVED}
                        >
                          {inputError || t('Migrate')}
                        </Button>
                      </RowBetween>
                    ) : (
                      <Button
                        variant={!isValid ? 'danger' : 'primary'}
                        onClick={() => {
                          setMintState({
                            mintToConfirm: mint,
                            attemptingTxn: false,
                            mintErrorMessage: undefined,
                            txHash: undefined,
                          })
                          onPresentConfirmModal()
                        }}
                        id="swap-button"
                        width="100%"
                        disabled={!isValid}
                      >
                        {inputError || t('Migrate')}
                      </Button>
                    )}
                    {showApproveFlow && (
                      <Column style={{ marginTop: '1rem' }}>
                        <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                      </Column>
                    )}
                  </Box>
                </Wrapper>
              </AppBody>
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
        </Flex>
      </Flex>
    </Page>
  )
}
