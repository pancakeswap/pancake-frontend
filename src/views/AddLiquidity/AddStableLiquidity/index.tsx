import { useCallback, useEffect, useMemo, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { CurrencyAmount, Token, WNATIVE } from '@pancakeswap/sdk'
import { Button, Text, AddIcon, CardBody, Message, useModal, TooltipText, useTooltip } from '@pancakeswap/uikit'
import { logError } from 'utils/sentry'
import { useTranslation } from '@pancakeswap/localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { CommitButton } from 'components/CommitButton'
import { getLPSymbol } from 'utils/getLpSymbol'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useRouter } from 'next/router'
import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'
import { useLPApr } from 'state/swap/hooks'
import { ROUTER_ADDRESS } from 'config/constants/exchange'
import { CAKE, USDC } from '@pancakeswap/tokens'
import { LightCard } from '../../../components/Card'
import { AutoColumn, ColumnCenter } from '../../../components/Layout/Column'
import CurrencyInputPanel from '../../../components/CurrencyInputPanel'
import ConnectWalletButton from '../../../components/ConnectWalletButton'

import { PairState } from '../../../hooks/usePairs'
import { useCurrency } from '../../../hooks/Tokens'
import { ApprovalState, useApproveCallback } from '../../../hooks/useApproveCallback'
import useTransactionDeadline from '../../../hooks/useTransactionDeadline'
import { Field, resetMintState } from '../../../state/mint/actions'
import { useMintActionHandlers, useMintState } from '../../../state/mint/hooks'

import { useTransactionAdder } from '../../../state/transactions/hooks'
import { useGasPrice, useIsExpertMode, usePairAdder, useUserSlippageTolerance } from '../../../state/user/hooks'
import { calculateGasMargin } from '../../../utils'
import { calculateSlippageAmount, useRouterContract } from '../../../utils/exchange'
import { maxAmountSpend } from '../../../utils/maxAmountSpend'
import Dots from '../../../components/Loader/Dots'
import PoolPriceBar from '../PoolPriceBar'
import Page from '../../Page'
import ConfirmAddLiquidityModal from '../components/ConfirmAddLiquidityModal'
import { formatAmount } from '../../../utils/formatInfoNumbers'
import { useCurrencySelectRoute } from '../useCurrencySelectRoute'
import { useAppDispatch } from '../../../state'
import { CommonBasesType } from '../../../components/SearchModal/types'
import { AppHeader, AppBody } from '../../../components/App'
import { RowBetween } from '../../../components/Layout/Row'
import { MinimalPositionCard } from '../../../components/PositionCard'
import { useStableLPDerivedMintInfo } from './hooks/useStableLPDerivedMintInfo'

export default function AddStableLiquidity() {
  const router = useRouter()
  const { account, chainId, isWrongNetwork } = useActiveWeb3React()

  const addPair = usePairAdder()
  const expertMode = useIsExpertMode()

  const native = useNativeCurrency()

  // Philip TODO: use stable coins by default
  const [currencyIdA, currencyIdB] = router.query.currency || [
    native.symbol,
    CAKE[chainId]?.address ?? USDC[chainId]?.address,
  ]

  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const gasPrice = useGasPrice()

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  useEffect(() => {
    if (!currencyIdA && !currencyIdB) {
      dispatch(resetMintState())
    }
  }, [dispatch, currencyIdA, currencyIdB])

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

  const poolData = useLPApr(pair)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(`Based on last 7 days' performance. Does not account for impermanent loss`),
    {
      placement: 'bottom',
    },
  )

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

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
  const deadline = useTransactionDeadline() // custom from users settings
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

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], ROUTER_ADDRESS[chainId])
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], ROUTER_ADDRESS[chainId])

  const addTransaction = useTransactionAdder()

  const routerContract = useRouterContract()

  async function onAdd() {
    if (!chainId || !account || !routerContract) return

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0],
    }

    let estimate
    let method: (...args: any) => Promise<TransactionResponse>
    let args: Array<string | string[] | number>
    let value: BigNumber | null
    if (currencyA?.isNative || currencyB?.isNative) {
      const tokenBIsNative = currencyB?.isNative
      estimate = routerContract.estimateGas.addLiquidityETH
      method = routerContract.addLiquidityETH
      args = [
        (tokenBIsNative ? currencyA : currencyB)?.wrapped?.address ?? '', // token
        (tokenBIsNative ? parsedAmountA : parsedAmountB).quotient.toString(), // token desired
        amountsMin[tokenBIsNative ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsNative ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline.toHexString(),
      ]
      value = BigNumber.from((tokenBIsNative ? parsedAmountB : parsedAmountA).quotient.toString())
    } else {
      estimate = routerContract.estimateGas.addLiquidity
      method = routerContract.addLiquidity
      args = [
        currencyA?.wrapped?.address ?? '',
        currencyB?.wrapped?.address ?? '',
        parsedAmountA.quotient.toString(),
        parsedAmountB.quotient.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline.toHexString(),
      ]
      value = null
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

          if (pair) {
            addPair(pair)
          }
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
    }
  }, [onFieldAInput, txHash])

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
                ? `${getLPSymbol(currencies[Field.CURRENCY_A].symbol, currencies[Field.CURRENCY_B].symbol)}`
                : t('Add Stable Liquidity')
            }
            subtitle={t('Receive LP tokens and earn 0.17% trading fees')}
            helper={t(
              'Liquidity providers earn a 0.17% trading fee on all trades made for that token pair, proportional to their share of the liquidity pool.',
            )}
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

              {pair && poolData && (
                <RowBetween>
                  <TooltipText ref={targetRef} bold fontSize="12px" color="secondary">
                    {t('LP reward APR')}
                  </TooltipText>
                  {tooltipVisible && tooltip}
                  <Text bold color="primary">
                    {formatAmount(poolData.lpApr7d)}%
                  </Text>
                </RowBetween>
              )}

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
