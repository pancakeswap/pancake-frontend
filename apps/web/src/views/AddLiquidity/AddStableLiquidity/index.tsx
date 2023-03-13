import { useCallback, useContext, useMemo, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { CurrencyAmount, Token, WNATIVE, Percent } from '@pancakeswap/sdk'
import {
  Button,
  Text,
  AddIcon,
  CardBody,
  Message,
  useModal,
  QuestionHelper,
  TooltipText,
  useTooltip,
  IconButton,
  PencilIcon,
  AutoColumn,
  ColumnCenter,
} from '@pancakeswap/uikit'
import { logError } from 'utils/sentry'
import { useTranslation } from '@pancakeswap/localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { CommitButton } from 'components/CommitButton'
import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'
import { StableConfigContext } from 'views/Swap/StableSwap/hooks/useStableConfig'
import { LightCard } from 'components/Card'
import { ONE_HUNDRED_PERCENT } from 'config/constants/exchange'
import { formatAmount } from 'utils/formatInfoNumbers'
import { useStableSwapAPR } from 'hooks/useStableSwapAPR'
import { useStableSwapNativeHelperContract } from 'hooks/useContract'

import CurrencyInputPanel from '../../../components/CurrencyInputPanel'
import ConnectWalletButton from '../../../components/ConnectWalletButton'

import { PairState } from '../../../hooks/usePairs'
import { ApprovalState, useApproveCallback } from '../../../hooks/useApproveCallback'
import { Field } from '../../../state/mint/actions'
import { useMintActionHandlers, useMintState } from '../../../state/mint/hooks'

import { useTransactionAdder } from '../../../state/transactions/hooks'
import { useGasPrice, useIsExpertMode, useUserSlippageTolerance } from '../../../state/user/hooks'
import { calculateGasMargin } from '../../../utils'
import { calculateSlippageAmount } from '../../../utils/exchange'
import { maxAmountSpend } from '../../../utils/maxAmountSpend'
import Dots from '../../../components/Loader/Dots'
import PoolPriceBar from '../PoolPriceBar'
import Page from '../../Page'
import ConfirmAddLiquidityModal from '../components/ConfirmAddLiquidityModal'
import { useCurrencySelectRoute } from '../useCurrencySelectRoute'
import { CommonBasesType } from '../../../components/SearchModal/types'
import { AppHeader, AppBody } from '../../../components/App'
import { RowBetween, RowFixed } from '../../../components/Layout/Row'
import { MinimalPositionCard } from '../../../components/PositionCard'
import { useStableLPDerivedMintInfo } from './hooks/useStableLPDerivedMintInfo'
import { useDerivedLPInfo } from './hooks/useDerivedLPInfo'
import { FormattedSlippage } from './components'
import { warningSeverity } from './utils/slippage'
import SettingsModal from '../../../components/Menu/GlobalSettings/SettingsModal'
import { SettingsMode } from '../../../components/Menu/GlobalSettings/types'

export default function AddStableLiquidity({ currencyA, currencyB }) {
  const { account, chainId, isWrongNetwork } = useActiveWeb3React()

  const expertMode = useIsExpertMode()

  const { t } = useTranslation()
  const gasPrice = useGasPrice()

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
    addError,
    loading: infoLoading,
  } = useStableLPDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(true)

  const nativeHelperContract = useStableSwapNativeHelperContract()

  // modal and loading
  const [{ attemptingTxn, liquidityErrorMessage, txHash }, setLiquidityState] = useState<{
    attemptingTxn: boolean
    liquidityErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    attemptingTxn: false,
    liquidityErrorMessage: undefined,
    txHash: undefined,
  })

  // txn values
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users
  const {
    lpOutputWithoutFee: expectedOutputWithoutFee,
    loading,
    price,
  } = useDerivedLPInfo(parsedAmounts[Field.CURRENCY_A], parsedAmounts[Field.CURRENCY_B])
  const minLPOutput = useMemo(
    () => expectedOutputWithoutFee && calculateSlippageAmount(expectedOutputWithoutFee, allowedSlippage)[0],
    [expectedOutputWithoutFee, allowedSlippage],
  )
  const executionSlippage = useMemo(() => {
    if (!liquidityMinted || !expectedOutputWithoutFee) {
      return null
    }
    return ONE_HUNDRED_PERCENT.subtract(new Percent(liquidityMinted.quotient, expectedOutputWithoutFee.quotient))
  }, [liquidityMinted, expectedOutputWithoutFee])

  const slippageSeverity = warningSeverity(executionSlippage)

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Token> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {},
  )

  const { handleCurrencyASelect, handleCurrencyBSelect } = useCurrencySelectRoute()

  // get formatted amounts
  const formattedAmounts = useMemo(
    () => ({
      [independentField]: typedValue,
      [dependentField]: otherTypedValue,
    }),
    [dependentField, independentField, otherTypedValue, typedValue],
  )

  const { stableSwapContract, stableSwapConfig } = useContext(StableConfigContext)
  const stableAPR = useStableSwapAPR(stableSwapContract.address)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(`Based on last 7 days' performance. Does not account for impermanent loss`),
    {
      placement: 'bottom',
    },
  )

  const needWrapped = currencyA?.isNative || currencyB?.isNative

  // check whether the user has approved tokens for addling LPs
  const [approvalA, approveACallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_A],
    needWrapped ? nativeHelperContract?.address : stableSwapContract?.address,
  )
  const [approvalB, approveBCallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_B],
    needWrapped ? nativeHelperContract?.address : stableSwapContract?.address,
  )

  const addTransaction = useTransactionAdder()

  async function onAdd() {
    const contract = needWrapped ? nativeHelperContract : stableSwapContract

    if (!chainId || !account || !contract) return

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts

    const atLeastOneCurrencyProvided = parsedAmountA?.greaterThan(0) || parsedAmountB?.greaterThan(0)
    const allCurrenciesProvided = parsedAmountA?.greaterThan(0) && parsedAmountB?.greaterThan(0)

    if (noLiquidity ? !allCurrenciesProvided : !atLeastOneCurrencyProvided) {
      return
    }

    const lpMintedSlippage = calculateSlippageAmount(liquidityMinted, noLiquidity ? 0 : allowedSlippage)[0]

    const estimate = contract.estimateGas.add_liquidity
    const method = contract.add_liquidity

    const quotientA = parsedAmountA?.quotient?.toString() || '0'
    const quotientB = parsedAmountB?.quotient?.toString() || '0'

    // Ensure the token order [token0, token1]
    const tokenAmounts =
      stableSwapConfig?.token0?.address === parsedAmountA?.currency?.wrapped?.address
        ? [quotientA, quotientB]
        : [quotientB, quotientA]

    let args = [tokenAmounts, minLPOutput?.toString() || lpMintedSlippage?.toString()]

    let value: BigNumber | null = null
    if (needWrapped) {
      args = [stableSwapContract.address, tokenAmounts, minLPOutput?.toString() || lpMintedSlippage?.toString()]
      value = BigNumber.from((currencyB?.isNative ? parsedAmountB : parsedAmountA).quotient.toString())
    }

    setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: undefined })
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
          gasPrice,
        }).then((response) => {
          setLiquidityState({ attemptingTxn: false, liquidityErrorMessage: undefined, txHash: response.hash })

          const symbolA = currencies[Field.CURRENCY_A]?.symbol
          const amountA = parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) || '0'
          const symbolB = currencies[Field.CURRENCY_B]?.symbol
          const amountB = parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) || '0'
          addTransaction(response, {
            summary: `Add ${amountA} ${symbolA} and ${amountB} ${symbolB}`,
            translatableSummary: {
              text: 'Add %amountA% %symbolA% and %amountB% %symbolB%',
              data: { amountA, symbolA, amountB, symbolB },
            },
            type: 'add-liquidity',
          })
        }),
      )
      .catch((err) => {
        if (err && err.code !== 4001) {
          logError(err)
          console.error(`Add Liquidity failed`, err, args, value)
        }
        setLiquidityState({
          attemptingTxn: false,
          liquidityErrorMessage:
            err && err.code !== 4001
              ? t('Add liquidity failed: %message%', { message: transactionErrorToUserReadableMessage(err, t) })
              : undefined,
          txHash: undefined,
        })
      })
  }

  const pendingText = t('Supplying %amountA% %symbolA% and %amountB% %symbolB%', {
    amountA: parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    symbolA: currencies[Field.CURRENCY_A]?.symbol ?? '',
    amountB: parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
    symbolB: currencies[Field.CURRENCY_B]?.symbol ?? '',
  })

  const handleDismissConfirmation = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
      onFieldBInput('')
    }
  }, [onFieldAInput, onFieldBInput, txHash])

  const [onPresentAddLiquidityModal] = useModal(
    <ConfirmAddLiquidityModal
      title={noLiquidity ? t('You are creating a trading pair') : t('You will receive')}
      customOnDismiss={handleDismissConfirmation}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      pendingText={pendingText}
      currencyToAdd={pair?.liquidityToken}
      allowedSlippage={allowedSlippage}
      onAdd={onAdd}
      parsedAmounts={parsedAmounts}
      currencies={currencies}
      liquidityErrorMessage={liquidityErrorMessage}
      price={price}
      noLiquidity={noLiquidity}
      poolTokenPercentage={poolTokenPercentage}
      liquidityMinted={liquidityMinted}
      isStable
    />,
    true,
    true,
    'addLiquidityModal',
  )

  let isValid = !error
  let errorText = error

  isValid = !error && !addError
  errorText = error ?? addError

  const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts

  const notApprovalYet =
    (parsedAmountA?.greaterThan(0) && approvalA !== ApprovalState.APPROVED) ||
    (parsedAmountB?.greaterThan(0) && approvalB !== ApprovalState.APPROVED)

  const buttonDisabled = !isValid || notApprovalYet || (slippageSeverity > 2 && !expertMode)

  const showFieldAApproval = approvalA === ApprovalState.NOT_APPROVED || approvalA === ApprovalState.PENDING
  const showFieldBApproval = approvalB === ApprovalState.NOT_APPROVED || approvalB === ApprovalState.PENDING

  const shouldShowApprovalGroup = (showFieldAApproval || showFieldBApproval) && isValid

  const oneCurrencyIsWNATIVE = Boolean(
    chainId && ((currencyA && currencyA.equals(WNATIVE[chainId])) || (currencyB && currencyB.equals(WNATIVE[chainId]))),
  )

  const [onPresentSettingsModal] = useModal(<SettingsModal mode={SettingsMode.SWAP_LIQUIDITY} />)

  return (
    <Page>
      <AppBody>
        <>
          <AppHeader
            title={
              currencies[Field.CURRENCY_A]?.symbol && currencies[Field.CURRENCY_B]?.symbol
                ? `${currencies[Field.CURRENCY_A].symbol}-${currencies[Field.CURRENCY_B].symbol} Stable LP`
                : t('Add Stable Liquidity')
            }
            backTo="/liquidity"
          />
          <CardBody>
            <AutoColumn gap="20px">
              {noLiquidity && (
                <ColumnCenter>
                  <Message variant="warning">
                    <div>
                      <Text bold mb="8px">
                        {t('You are the first liquidity provider.')}
                      </Text>
                      <Text mb="8px">{t('The ratio of tokens you add will set the price of this pair.')}</Text>
                      <Text>{t('Once you are happy with the rate click supply to review.')}</Text>
                    </div>
                  </Message>
                </ColumnCenter>
              )}
              <CurrencyInputPanel
                showUSDPrice
                onCurrencySelect={handleCurrencyASelect}
                zapStyle="noZap"
                value={formattedAmounts[Field.CURRENCY_A]}
                onUserInput={onFieldAInput}
                onPercentInput={(percent) => {
                  if (maxAmounts[Field.CURRENCY_A]) {
                    onFieldAInput(maxAmounts[Field.CURRENCY_A]?.multiply(new Percent(percent, 100)).toExact() ?? '')
                  }
                }}
                onMax={() => {
                  onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                }}
                showQuickInputButton
                showMaxButton
                maxAmount={maxAmounts[Field.CURRENCY_A]}
                currency={currencies[Field.CURRENCY_A]}
                id="add-liquidity-input-tokena"
                showCommonBases
                commonBasesType={CommonBasesType.LIQUIDITY}
              />
              <ColumnCenter>
                <AddIcon width="16px" />
              </ColumnCenter>
              <CurrencyInputPanel
                showUSDPrice
                onCurrencySelect={handleCurrencyBSelect}
                zapStyle="noZap"
                value={formattedAmounts[Field.CURRENCY_B]}
                onUserInput={onFieldBInput}
                onPercentInput={(percent) => {
                  if (maxAmounts[Field.CURRENCY_B]) {
                    onFieldBInput(maxAmounts[Field.CURRENCY_B]?.multiply(new Percent(percent, 100)).toExact() ?? '')
                  }
                }}
                onMax={() => {
                  onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                }}
                showQuickInputButton
                showMaxButton
                maxAmount={maxAmounts[Field.CURRENCY_B]}
                currency={currencies[Field.CURRENCY_B]}
                id="add-liquidity-input-tokenb"
                showCommonBases
                commonBasesType={CommonBasesType.LIQUIDITY}
              />

              {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
                <>
                  <LightCard padding="0px" borderRadius="20px">
                    <RowBetween padding="1rem">
                      <Text fontSize="14px">
                        {noLiquidity ? t('Initial prices and share in the pair') : t('Prices and Share')}
                      </Text>
                    </RowBetween>{' '}
                    <LightCard padding="1rem" borderRadius="20px">
                      <PoolPriceBar
                        currencies={currencies}
                        poolTokenPercentage={poolTokenPercentage}
                        noLiquidity={noLiquidity}
                        price={price}
                      />
                    </LightCard>
                  </LightCard>
                </>
              )}

              <RowBetween>
                <RowFixed>
                  <Text bold fontSize="12px" color="secondary">
                    {t('Slippage')}
                  </Text>
                  <QuestionHelper
                    text={t(
                      'Based on % contributed to stable pair, fees will vary. Deposits with fees >= 0.15% will be rejected',
                    )}
                    size="14px"
                    ml="4px"
                    placement="top-start"
                  />
                </RowFixed>

                <FormattedSlippage
                  slippage={executionSlippage}
                  loading={!executionSlippage && (loading || infoLoading)}
                />
              </RowBetween>

              <RowBetween>
                <Text bold fontSize="12px" color="secondary">
                  {t('Slippage Tolerance')}
                  <IconButton scale="sm" variant="text" onClick={onPresentSettingsModal}>
                    <PencilIcon color="primary" width="10px" />
                  </IconButton>
                </Text>
                <Text bold color="primary">
                  {allowedSlippage / 100}%
                </Text>
              </RowBetween>

              {stableAPR ? (
                <RowBetween>
                  <TooltipText ref={targetRef} bold fontSize="12px" color="secondary">
                    {t('LP reward APR')}
                  </TooltipText>
                  {tooltipVisible && tooltip}
                  <Text bold color="primary">
                    {formatAmount(stableAPR)}%
                  </Text>
                </RowBetween>
              ) : null}

              {!account ? (
                <ConnectWalletButton />
              ) : isWrongNetwork ? (
                <CommitButton />
              ) : (
                <AutoColumn gap="md">
                  {shouldShowApprovalGroup && (
                    <RowBetween style={{ gap: '8px' }}>
                      {showFieldAApproval && (
                        <Button onClick={approveACallback} disabled={approvalA === ApprovalState.PENDING} width="100%">
                          {approvalA === ApprovalState.PENDING ? (
                            <Dots>{t('Enabling %asset%', { asset: currencies[Field.CURRENCY_A]?.symbol })}</Dots>
                          ) : (
                            t('Enable %asset%', { asset: currencies[Field.CURRENCY_A]?.symbol })
                          )}
                        </Button>
                      )}
                      {showFieldBApproval && (
                        <Button onClick={approveBCallback} disabled={approvalB === ApprovalState.PENDING} width="100%">
                          {approvalB === ApprovalState.PENDING ? (
                            <Dots>{t('Enabling %asset%', { asset: currencies[Field.CURRENCY_B]?.symbol })}</Dots>
                          ) : (
                            t('Enable %asset%', { asset: currencies[Field.CURRENCY_B]?.symbol })
                          )}
                        </Button>
                      )}
                    </RowBetween>
                  )}
                  <CommitButton
                    variant={!isValid || slippageSeverity > 2 ? 'danger' : 'primary'}
                    onClick={() => {
                      if (expertMode) {
                        onAdd()
                      } else {
                        setLiquidityState({
                          attemptingTxn: false,
                          liquidityErrorMessage: undefined,
                          txHash: undefined,
                        })
                        onPresentAddLiquidityModal()
                      }
                    }}
                    disabled={buttonDisabled}
                  >
                    {errorText || t('Supply')}
                  </CommitButton>
                </AutoColumn>
              )}
            </AutoColumn>
          </CardBody>
        </>
      </AppBody>
      {pair && !noLiquidity && pairState !== PairState.INVALID ? (
        <AutoColumn style={{ minWidth: '20rem', width: '100%', maxWidth: '400px', marginTop: '1rem' }}>
          <MinimalPositionCard showUnwrapped={oneCurrencyIsWNATIVE} pair={pair} />
        </AutoColumn>
      ) : null}
    </Page>
  )
}
