import { AptosSwapRouter } from '@pancakeswap/aptos-swap-sdk'

import { useCallback, useContext, useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'

import { useSendTransaction, useSimulateTransaction } from '@pancakeswap/awgmi'

import { useTransactionAdder } from 'state/transactions/hooks'
import { calculateSlippageAmount } from 'utils/exchange'
import { useUserSlippage } from 'state/user'

import { CurrencySelectorContext } from './useCurrencySelectRoute'
import { Field } from '../type'

export default function useAddLiquidityHanlder({ parsedAmounts, noLiquidity }) {
  const { currencyA, currencyB } = useContext(CurrencySelectorContext)
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

  const onAdd = useCallback(async () => {
    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0],
    }

    setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: undefined })
    const payload = AptosSwapRouter.unstable_addLiquidityParameters(
      parsedAmountA?.quotient?.toString(),
      parsedAmountB?.quotient?.toString(),
      amountsMin[Field.CURRENCY_A].toString() ?? '',
      amountsMin[Field.CURRENCY_B].toString() ?? '',
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
  }, [addTransaction, currencyA, currencyB, parsedAmounts, sendTransactionAsync, simulateTransactionAsync, t])

  return {
    onAdd,
    attemptingTxn,
    liquidityErrorMessage,
    txHash,
    setLiquidityState,
  }
}
