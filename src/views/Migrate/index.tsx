import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { CurrencyAmount, JSBI, Mint, Price, TokenAmount } from 'peronio-sdk'
import { Button, Text, ArrowDownIcon, Box, useModal, Flex, IconButton, ArrowUpDownIcon } from 'peronio-uikit'
import { RouteComponentProps } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { useMintCallback } from 'hooks/useMintCallback'
import { useMigrateTokenInfo } from 'state/tokenMigrate/hooks'
import { useMigratorContract } from 'hooks/useContract'
import { debounce } from 'lodash'
import { tryParseAmount } from 'state/swap/hooks'
import { mainnetTokens } from 'config/constants/tokens'
import { useCurrency } from 'hooks/Tokens'
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
import {
  ApprovalState,
  useApproveCallbackFromMigrate,
  useApproveCallbackFromMint,
} from '../../hooks/useApproveCallback'
import { Field } from '../../state/tokenMigrate/actions'
import { useDefaultsFromURLSearch, useSwapActionHandlers, useSwapState } from '../../state/swap/hooks'
import { useExpertModeManager } from '../../state/user/hooks'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import CircleLoader from '../../components/Loader/CircleLoader'
import Page from '../Page'
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

export default function MigrateView({ history }: RouteComponentProps) {
  useDefaultsFromURLSearch()
  const { t } = useTranslation()

  const { account } = useActiveWeb3React()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()
  const migratorContract = useMigratorContract()

  // readonly inputAmount: CurrencyAmount;
  // /**
  //  * The output amount for the trade assuming no slippage.
  //  */
  // readonly outputAmount: CurrencyAmount;
  // /**
  //  * The price expressed in terms of output amount/input amount.
  //  */
  // readonly executionPrice: Price;
  // /**
  //  * The input amount for the trade assuming no slippage.
  //  */
  // readonly feeAmount: number;
  // /**
  //  * The input amount for the trade assuming no slippage.
  //  */
  // readonly minReceive: number;
  // /**
  //  * The input amount for the trade assuming no slippage.
  //  */
  // readonly markup: Percent;

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const { mint, parsedAmount, currencies, currencyBalances, inputError: swapInputError } = useMigrateTokenInfo()
  const [migrate, setMigrate] = useState<any>()
  // const [mint, setMint] = useState({ inputAmount: 0, outputAmount: 0 })
  const [state, setState] = useState<string>('0.0')
  const [outPutState, setOutPutState] = useState<string>('0x00')
  const [output, setOutput] = useState<string>('0.0')
  const [outputString, setOutputString] = useState<string>('0.0')
  const [outputUSDCString, setOutputUSDCString] = useState<string>('0.0')

  const parsedAmounts = {
    [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : migrate?.inputAmount,
    [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : migrate?.outputAmount,
  }

  const { onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = state //! swapInputError
  const dependentField: Field = Field.INPUT

  const inputCurrencyId = mainnetTokens.pe.address
  const outputCurrencyId = mainnetTokens.p.address
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const [inputAmount, setInputAmount] = useState<CurrencyAmount | undefined>()
  const [outputAmount, setOutputAmount] = useState<CurrencyAmount | undefined>()
  const calculateOutput = debounce(
    (value) =>
      migratorContract.quote(value).then((resultado: React.SetStateAction<string>) => {
        setOutput(resultado)
        const parsedOutputAmount = new TokenAmount(mainnetTokens.p, JSBI.BigInt(resultado[1]))

        setOutputAmount(parsedOutputAmount)

        setOutputString(resultado[1])
        setOutputUSDCString(resultado[0])
      }),
    10,
  )

  const handleTypeInput = useCallback(
    (value: string) => {
      if (value === undefined) return
      setState(value)
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
  // console.info("value", state)
  console.info('output', output)

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
  console.log(approval)
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
    migratorContract
      .migrate(inputAmount.toExact())
      .then(() => {
        setMintState({ attemptingTxn: false, mintToConfirm, mintErrorMessage: undefined, txHash: undefined })
      })
      .catch((error) => {
        setMintState({
          attemptingTxn: false,
          mintToConfirm,
          mintErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [inputAmount, migratorContract, mintToConfirm])

  const handleSwap = useCallback(() => {
    // if (!mintCallback) {
    //   return
    // }
    setMintState({ attemptingTxn: true, mintToConfirm, mintErrorMessage: undefined, txHash: undefined })
    migrateCallback()
  }, [migrateCallback, mintToConfirm])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)
  console.log(approvalSubmitted)
  // warnings on slippage
  const priceImpactSeverity = 0

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    approval === ApprovalState.NOT_APPROVED ||
    approval === ApprovalState.PENDING ||
    (approvalSubmitted && approval === ApprovalState.APPROVED)

  const handleConfirmDismiss = useCallback(() => {
    setMintState({ mintToConfirm, attemptingTxn, mintErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
  }, [attemptingTxn, mintErrorMessage, mintToConfirm, txHash])

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
  const [onPresentConfirmModal] = useModal(
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
                      value={state ?? '0'}
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
                        <SwitchIconButton variant="light" scale="sm">
                          <ArrowDownIcon
                            className="icon-down"
                            color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? 'primary' : 'text'}
                          />
                        </SwitchIconButton>
                      </AutoRow>
                    </AutoColumn>
                    <CurrencyInputPanel
                      value={outputUSDCString}
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
                      <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
                        <SwitchIconButton variant="light" scale="sm">
                          <ArrowDownIcon
                            className="icon-down"
                            color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? 'primary' : 'text'}
                          />
                        </SwitchIconButton>
                      </AutoRow>
                    </AutoColumn>
                    <CurrencyInputPanel
                      value={outputString}
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
                            if (isExpertMode) {
                              handleSwap()
                            } else {
                              setMintState({
                                mintToConfirm: migrate,
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
                          {t('Migrate')}
                        </Button>
                      </RowBetween>
                    ) : (
                      <Button
                        variant={isValid ? 'danger' : 'primary'}
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
                        {priceImpactSeverity > 3 && !isExpertMode
                          ? t('Price Impact Too High')
                          : priceImpactSeverity > 2
                          ? t('Mint Anyway')
                          : t('Migrate')}
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
