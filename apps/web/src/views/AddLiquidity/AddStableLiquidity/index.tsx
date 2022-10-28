import { useCallback, useContext, useMemo, useState } from 'react'
import { CurrencyAmount, Token, WNATIVE } from '@pancakeswap/sdk'
import { Button, Text, AddIcon, CardBody, Message, useModal } from '@pancakeswap/uikit'
import { logError } from 'utils/sentry'
import { useTranslation } from '@pancakeswap/localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { CommitButton } from 'components/CommitButton'
import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'
import { StableConfigContext } from 'views/Swap/StableSwap/hooks/useStableConfig'
import { LightCard } from 'components/Card'

import { AutoColumn, ColumnCenter } from '../../../components/Layout/Column'
import CurrencyInputPanel from '../../../components/CurrencyInputPanel'
import ConnectWalletButton from '../../../components/ConnectWalletButton'

import { PairState } from '../../../hooks/usePairs'
import { ApprovalState, useApproveCallback } from '../../../hooks/useApproveCallback'
import { Field } from '../../../state/mint/actions'
import { useMintActionHandlers, useMintState } from '../../../state/mint/hooks'

import { useTransactionAdder } from '../../../state/transactions/hooks'
import { useIsExpertMode, useUserSlippageTolerance } from '../../../state/user/hooks'
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
import { RowBetween } from '../../../components/Layout/Row'
import { MinimalPositionCard } from '../../../components/PositionCard'
import { useStableLPDerivedMintInfo } from './hooks/useStableLPDerivedMintInfo'

export default function AddStableLiquidity({ currencyA, currencyB }) {
  const { account, chainId, isWrongNetwork } = useActiveWeb3React()

  const expertMode = useIsExpertMode()

  const { t } = useTranslation()

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
    addError,
  } = useStableLPDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(true)

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

  const atMaxAmounts: { [field in Field]?: CurrencyAmount<Token> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
      }
    },
    {},
  )

  const { stableSwapContract, stableSwapConfig } = useContext(StableConfigContext)

  // check whether the user has approved tokens for addling LPs
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], stableSwapContract?.address)
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], stableSwapContract?.address)

  const addTransaction = useTransactionAdder()

  async function onAdd() {
    if (!chainId || !account || !stableSwapContract) return

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB) {
      return
    }

    const lpMintedSlippage = calculateSlippageAmount(liquidityMinted, noLiquidity ? 0 : allowedSlippage)[0]

    const estimate = stableSwapContract.estimateGas.add_liquidity
    const method = stableSwapContract.add_liquidity

    // Ensure the token order [token0, token1]
    const tokenAmounts =
      stableSwapConfig?.token0?.address === parsedAmountA?.currency?.wrapped?.address
        ? [parsedAmountA?.quotient?.toString(), parsedAmountB?.quotient?.toString()]
        : [parsedAmountB?.quotient?.toString(), parsedAmountA?.quotient?.toString()]

    const args = [tokenAmounts, lpMintedSlippage?.toString()]

    const value = null

    setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: undefined })
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
        }).then((response) => {
          setLiquidityState({ attemptingTxn: false, liquidityErrorMessage: undefined, txHash: response.hash })

          const symbolA = currencies[Field.CURRENCY_A]?.symbol
          const amountA = parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)
          const symbolB = currencies[Field.CURRENCY_B]?.symbol
          const amountB = parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)
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
      title={noLiquidity ? t('You are creating a pool') : t('You will receive')}
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

  const buttonDisabled = !isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED

  const showFieldAApproval = approvalA === ApprovalState.NOT_APPROVED || approvalA === ApprovalState.PENDING
  const showFieldBApproval = approvalB === ApprovalState.NOT_APPROVED || approvalB === ApprovalState.PENDING

  const shouldShowApprovalGroup = (showFieldAApproval || showFieldBApproval) && isValid

  const oneCurrencyIsWNATIVE = Boolean(
    chainId && ((currencyA && currencyA.equals(WNATIVE[chainId])) || (currencyB && currencyB.equals(WNATIVE[chainId]))),
  )

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
                      <Text mb="8px">{t('The ratio of tokens you add will set the price of this pool.')}</Text>
                      <Text>{t('Once you are happy with the rate click supply to review.')}</Text>
                    </div>
                  </Message>
                </ColumnCenter>
              )}
              <CurrencyInputPanel
                showBUSD
                onCurrencySelect={handleCurrencyASelect}
                zapStyle="noZap"
                value={formattedAmounts[Field.CURRENCY_A]}
                onUserInput={onFieldAInput}
                onMax={() => {
                  onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                }}
                showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                currency={currencies[Field.CURRENCY_A]}
                id="add-liquidity-input-tokena"
                showCommonBases
                commonBasesType={CommonBasesType.LIQUIDITY}
              />
              <ColumnCenter>
                <AddIcon width="16px" />
              </ColumnCenter>
              <CurrencyInputPanel
                showBUSD
                onCurrencySelect={handleCurrencyBSelect}
                zapStyle="noZap"
                value={formattedAmounts[Field.CURRENCY_B]}
                onUserInput={onFieldBInput}
                onMax={() => {
                  onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                }}
                showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
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
                        {noLiquidity ? t('Initial prices and pool share') : t('Prices and pool share')}
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
                <Text bold fontSize="12px" color="secondary">
                  {t('Slippage Tolerance')}
                </Text>
                <Text bold color="primary">
                  {allowedSlippage / 100}%
                </Text>
              </RowBetween>

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
                    variant={!isValid ? 'danger' : 'primary'}
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
