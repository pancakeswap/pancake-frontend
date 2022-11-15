import { Router, Currency, CurrencyAmount } from '@pancakeswap/aptos-swap-sdk'
import { SimulateTransactionError, UserRejectedRequestError } from '@pancakeswap/awgmi/core'
import { useTranslation } from '@pancakeswap/localization'
import useSimulationAndSendTransaction from 'hooks/useSimulationAndSendTransaction'
import { useCallback, useMemo, useState } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useUserSlippage } from 'state/user'
import { calculateSlippageAmount } from 'utils/exchange'
import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'
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
  const executeTransaction = useSimulationAndSendTransaction()
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
    const payload = Router.removeLiquidityParameters(
      parsedAmounts[Field.LIQUIDITY]?.quotient?.toString() ?? '',
      amountsMin[Field.CURRENCY_A]?.toString() ?? '',
      amountsMin[Field.CURRENCY_B]?.toString() ?? '',
      currencyA.wrapped.address,
      currencyB.wrapped.address,
    )

    setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: undefined })

    executeTransaction(payload, (error) => {
      if (error instanceof SimulateTransactionError) {
        setLiquidityState({
          attemptingTxn: false,
          liquidityErrorMessage: transactionErrorToUserReadableMessage(error),
          txHash: undefined,
        })
      }
    })
      .then((response) => {
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
      .catch((err) => {
        let errorMsg = ''

        if (!(err instanceof UserRejectedRequestError)) {
          errorMsg = t('Remove liquidity failed: %message%', {
            message: transactionErrorToUserReadableMessage(err),
          })
        }

        setLiquidityState({
          attemptingTxn: false,
          liquidityErrorMessage: errorMsg,
          txHash: undefined,
        })
      })
  }, [parsedAmounts, amountsMin, currencyA, currencyB, executeTransaction, addTransaction, t])

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
