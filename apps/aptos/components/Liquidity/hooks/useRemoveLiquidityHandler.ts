import { AptosSwapRouter } from '@pancakeswap/aptos-swap-sdk'
import { useSendTransaction, useSimulateTransaction } from '@pancakeswap/awgmi'
import { useTranslation } from '@pancakeswap/localization'
import { useCallback, useState } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useUserSlippage } from 'state/user'
import { calculateSlippageAmount } from 'utils/exchange'
import { Field } from '../type'

export default function useRemoveLiquidityHandler({ parsedAmounts, currencyA, currencyB }) {
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

  const onRemove = useCallback(async () => {
    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmounts[Field.CURRENCY_A], allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmounts[Field.CURRENCY_B], allowedSlippage)[0],
    }

    const payload = AptosSwapRouter.unstable_removeLiquidityParameters(
      parsedAmounts[Field.LIQUIDITY]?.quotient?.toString() ?? '',
      amountsMin[Field.CURRENCY_A]?.toString() ?? '',
      amountsMin[Field.CURRENCY_B]?.toString() ?? '',
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
  }, [currencyA, currencyB, parsedAmounts, addTransaction, simulateTransactionAsync, sendTransactionAsync, t])

  return {
    onRemove,
    attemptingTxn,
    liquidityErrorMessage,
    txHash,
    setLiquidityState,
  }
}
