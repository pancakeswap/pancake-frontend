import { AptosSwapRouter, CurrencyAmount, Token } from '@pancakeswap/aptos-swap-sdk'
import { useTranslation } from '@pancakeswap/localization'
import { AddIcon, AutoColumn, Button, CardBody, ColumnCenter, Message, RowBetween, Text } from '@pancakeswap/uikit'
import { CommitButton } from 'components/CommitButton'
import { useIsTransactionUnsupported, useIsTransactionWarning } from 'hooks/Trades'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallback, useMemo, useState } from 'react'
// import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'
import { Field, useDerivedMintInfo, useMintActionHandlers, useMintState } from 'state/mint'
import { maxAmountSpend } from 'utils/maxAmountSpend'
// import PoolPriceBar from './PoolPriceBar'
import { useSendTransaction, useSimulateTransaction } from '@pancakeswap/awgmi'
import { useIsMounted } from '@pancakeswap/hooks'
import { CurrencyInputPanel } from 'components/CurrencyInputPanel'
import { USDC_DEVNET } from 'config/coins'
import { useCurrency } from 'hooks/Tokens'
import useNativeCurrency from 'hooks/useNativeCurrency'
// import { useRouter } from 'next/router'
import { useTransactionAdder } from 'state/transactions/hooks'
import { usePairAdder, useUserSlippage } from 'state/user'
import { useIsExpertMode } from 'state/user/expertMode'

/**
 * @TODO
 * 1. router params
 * 2. PoolPriceBar
 * 3. Confirm Modal
 *
 *
 * @TBD
 * 1. slippage prevent from smart contract
 * 2. mapping error from smart contract
 */

export default function AddLiquidity() {
  // const router = useRouter()
  const native = useNativeCurrency()
  // TODO: router
  const [currencyIdA, setCurrencyIdA] = useState(native.wrapped.address)
  const [currencyIdB, setCurrencyIdB] = useState(USDC_DEVNET.address)

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const { account, chainId } = useActiveWeb3React()

  const addPair = usePairAdder()
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
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

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
  const [allowedSlippage] = useUserSlippage() // custom from users

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

  // get formatted amounts
  const formattedAmounts = useMemo(
    () => ({
      [independentField]: typedValue,
      [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
    }),
    [dependentField, independentField, noLiquidity, otherTypedValue, parsedAmounts, typedValue],
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

  const addTransaction = useTransactionAdder()
  const { simulateTransactionAsync } = useSimulateTransaction()
  const { sendTransactionAsync } = useSendTransaction()

  async function onAdd() {
    if (!chainId || !account) return

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB) {
      return
    }

    // TODO: slippage on sc
    // const amountsMin = {
    //   [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
    //   [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0],
    // }

    setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: undefined })
    const payload = AptosSwapRouter.unstable_addLiquidityParameters(
      parsedAmountA.quotient.toString() ?? '',
      parsedAmountB.quotient.toString() ?? '',
      currencyA.wrapped.address,
      currencyB.wrapped.address,
    )
    console.info(payload, 'payload')
    await simulateTransactionAsync({
      payload,
    })
      .then(() => {
        sendTransactionAsync({
          payload,
        }).then((response) => {
          setLiquidityState({ attemptingTxn: false, liquidityErrorMessage: undefined, txHash: response.hash })
          const symbolA = currencyA.symbol
          const amountA = parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) ?? ''
          const symbolB = currencyB.symbol
          const amountB = parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) ?? ''
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
        })
      })
      .catch((err) => {
        console.error(`Add Liquidity failed`, err, payload)
        setLiquidityState({
          attemptingTxn: false,
          liquidityErrorMessage:
            // TODO: map error
            err && err.code !== 4001 ? t('Add liquidity failed: %message%', { message: err.message }) : undefined,
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

  const addIsUnsupported = useIsTransactionUnsupported(currencies?.currencyA, currencies?.currencyB)
  const addIsWarning = useIsTransactionWarning(currencies?.currencyA, currencies?.currencyB)

  // const [onPresentAddLiquidityModal] = useModal(
  //   <ConfirmAddLiquidityModal
  //     title={noLiquidity ? t('You are creating a pool') : t('You will receive')}
  //     customOnDismiss={handleDismissConfirmation}
  //     attemptingTxn={attemptingTxn}
  //     hash={txHash}
  //     pendingText={pendingText}
  //     currencyToAdd={pair?.liquidityToken}
  //     allowedSlippage={allowedSlippage}
  //     onAdd={onAdd}
  //     parsedAmounts={parsedAmounts}
  //     currencies={currencies}
  //     liquidityErrorMessage={liquidityErrorMessage}
  //     price={price}
  //     noLiquidity={noLiquidity}
  //     poolTokenPercentage={poolTokenPercentage}
  //     liquidityMinted={liquidityMinted}
  //   />,
  //   true,
  //   true,
  //   'addLiquidityModal',
  // )

  let isValid = !error
  let errorText = error

  isValid = !error && !addError
  errorText = error ?? addError

  const buttonDisabled = !isValid

  return (
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
          onCurrencySelect={(c) => setCurrencyIdA(c.wrapped.address)}
          value={formattedAmounts[Field.CURRENCY_A]}
          onUserInput={onFieldAInput}
          onMax={() => {
            onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
          }}
          showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
          currency={currencies[Field.CURRENCY_A]}
          id="add-liquidity-input-tokena"
          // showCommonBases
          // commonBasesType={CommonBasesType.LIQUIDITY}
        />
        <ColumnCenter>
          <AddIcon width="16px" />
        </ColumnCenter>
        <CurrencyInputPanel
          onCurrencySelect={(c) => setCurrencyIdB(c.wrapped.address)}
          value={formattedAmounts[Field.CURRENCY_B]}
          onUserInput={onFieldBInput}
          onMax={() => {
            onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
          }}
          showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
          currency={currencies[Field.CURRENCY_B]}
          id="add-liquidity-input-tokenb"
          // showCommonBases
          // commonBasesType={CommonBasesType.LIQUIDITY}
        />

        {/* {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
          <>
            <LightCard padding="0px" borderRadius="20px">
              <RowBetween padding="1rem">
                <Text fontSize="14px">
                  {noLiquidity ? t('Initial prices and pool share') : t('Prices and pool share')}
                </Text>
              </RowBetween>{' '}
              <LightCard padding="16px" borderRadius="20px">
                <PoolPriceBar
                  currencies={currencies}
                  poolTokenPercentage={preferZapInstead ? zapIn.poolTokenPercentage : poolTokenPercentage}
                  noLiquidity={noLiquidity}
                  price={price}
                />
              </LightCard>
            </LightCard>
          </>
        )} */}

        <AllowedSlippage />

        {addIsUnsupported || addIsWarning ? (
          <Button disabled mb="4px">
            {t('Unsupported Asset')}
          </Button>
        ) : (
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
                onAdd()
                // onPresentAddLiquidityModal()
              }
            }}
            disabled={buttonDisabled}
          >
            {errorText || t('Supply')}
          </CommitButton>
        )}
      </AutoColumn>
    </CardBody>
  )
}

// TODO: aptos merge
export const AllowedSlippage = () => {
  const [allowedSlippage] = useUserSlippage()
  const isMounted = useIsMounted()
  const { t } = useTranslation()
  return (
    <RowBetween>
      <Text bold fontSize="12px" color="secondary">
        {t('Slippage Tolerance')}
      </Text>
      {isMounted && (
        <Text bold color="primary">
          {allowedSlippage / 100}%
        </Text>
      )}
    </RowBetween>
  )
}
