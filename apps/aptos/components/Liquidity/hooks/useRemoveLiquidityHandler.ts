import { AptosSwapRouter, Currency, CurrencyAmount } from '@pancakeswap/aptos-swap-sdk'
import { useSendTransaction, useSimulateTransaction } from '@pancakeswap/awgmi'
import { useTranslation } from '@pancakeswap/localization'
import { useCallback, useMemo, useState } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useUserSlippage } from 'state/user'
import { calculateSlippageAmount } from 'utils/exchange'
import { Field, LiquidityHandlerReturn } from '../type'

interface UseRemoveLiquidityHandlerReturn extends LiquidityHandlerReturn {
  onRemove: () => void
}

export default function useRemoveLiquidityHandler({
  parsedAmounts,
  currencyA,
  currencyB,
}: {
  parsedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  currencyA: Currency
  currencyB: Currency
}): UseRemoveLiquidityHandlerReturn {
  const { t } = useTranslation()

  const addTransaction = useTransactionAdder()
  const { simulateTransactionAsync } = useSimulateTransaction()
  const { sendTransactionAsync } = useSendTransaction()
  const [allowedSlippage] = useUserSlippage() // custom from users

  const [{ attemptingTxn, liquidityErrorMessage, txHash }, setLiquidityState] = useState<{
    attemptingTxn: boolean
    liquidityErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    attemptingTxn: false,
    liquidityErrorMessage: undefined,
    txHash: undefined,
  })

  const { [Field.CURRENCY_A]: parsedAAmount, [Field.CURRENCY_B]: parsedBAmount } = parsedAmounts

  const amountsMin = useMemo(
    () => ({
      [Field.CURRENCY_A]: parsedAAmount && calculateSlippageAmount(parsedAAmount, allowedSlippage)[0],
      [Field.CURRENCY_B]: parsedBAmount && calculateSlippageAmount(parsedBAmount, allowedSlippage)[0],
    }),
    [parsedAAmount, parsedBAmount, allowedSlippage],
  )

  const onRemove = useCallback(async () => {
    const payload = AptosSwapRouter.unstable_removeLiquidityParameters(
      parsedAmounts[Field.LIQUIDITY]?.quotient?.toString() ?? '',
      amountsMin[Field.CURRENCY_A]?.toString() ?? '',
      amountsMin[Field.CURRENCY_B]?.toString() ?? '',
      currencyA.wrapped.address,
      currencyB.wrapped.address,
    )

    console.info(payload, 'payload')
    simulateTransactionAsync({
      payload,
    })
      .then(() => {
        return sendTransactionAsync({
          payload,
        }).then((response) => {
          setLiquidityState({ attemptingTxn: false, liquidityErrorMessage: undefined, txHash: response.hash })
          const symbolA = currencyA.symbol
          const amountA = parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) ?? ''
          const symbolB = currencyB.symbol
          const amountB = parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) ?? ''
          addTransaction(response, {
            summary: `Remove ${amountA} ${symbolA} and ${amountB} ${symbolB}`,
            translatableSummary: {
              text: 'Remove %amountA% %symbolA% and %amountB% %symbolB%',
              data: { amountA, symbolA, amountB, symbolB },
            },
            type: 'remove-liquidity',
          })
        })
      })
      .catch((err) => {
        console.error(`Remove Liquidity failed`, err, payload)
        setLiquidityState({
          attemptingTxn: false,
          liquidityErrorMessage:
            // TODO: map error
            err && err.code !== 4001 ? t('Remove liquidity failed: %message%', { message: err.message }) : undefined,
          txHash: undefined,
        })
      })
  }, [
    currencyA,
    currencyB,
    parsedAmounts,
    addTransaction,
    simulateTransactionAsync,
    sendTransactionAsync,
    t,
    amountsMin,
  ])

  return useMemo(
    () => ({
      onRemove,
      attemptingTxn,
      liquidityErrorMessage,
      txHash,
      setLiquidityState,
    }),
    [onRemove, attemptingTxn, liquidityErrorMessage, txHash, setLiquidityState],
  )
}
