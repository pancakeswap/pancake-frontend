import { Currency, CurrencyAmount, Router } from '@pancakeswap/aptos-swap-sdk'
import { SimulateTransactionError, UserRejectedRequestError } from '@pancakeswap/awgmi/core'
import { useTranslation } from '@pancakeswap/localization'
import { log } from 'next-axiom'
import { useCallback, useContext, useMemo, useState } from 'react'

import useSimulationAndSendTransaction from 'hooks/useSimulationAndSendTransaction'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useUserSlippage } from 'state/user'
import { calculateSlippageAmount } from 'utils/exchange'
import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'

import { Field, LiquidityHandlerReturn } from '../type'
import { CurrencySelectorContext } from './useCurrencySelectRoute'

interface UseAddLiquidityHandlerReturn extends LiquidityHandlerReturn {
  onAdd: () => void
}

export default function useAddLiquidityHandler({
  parsedAmounts,
  noLiquidity,
}: {
  noLiquidity: boolean
  parsedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
}): UseAddLiquidityHandlerReturn {
  const { currencyA, currencyB } = useContext(CurrencySelectorContext)
  const { t } = useTranslation()
  const addTransaction = useTransactionAdder()

  const [allowedSlippage] = useUserSlippage() // custom from users
  const executeTransaction = useSimulationAndSendTransaction()

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
      [Field.CURRENCY_A]: parsedAAmount && calculateSlippageAmount(parsedAAmount, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: parsedBAmount && calculateSlippageAmount(parsedBAmount, noLiquidity ? 0 : allowedSlippage)[0],
    }),
    [parsedAAmount, parsedBAmount, allowedSlippage, noLiquidity],
  )

  const onAdd = useCallback(async () => {
    if (!currencyA || !currencyB) {
      return
    }

    setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: undefined })
    const payload = Router.addLiquidityParameters(
      parsedAAmount?.quotient?.toString() ?? '',
      parsedBAmount?.quotient?.toString() ?? '',
      amountsMin?.[Field.CURRENCY_A]?.toString() ?? '',
      amountsMin?.[Field.CURRENCY_B]?.toString() ?? '',
      currencyA.wrapped.address,
      currencyB.wrapped.address,
    )

    executeTransaction(payload, (error) => {
      log.error('Add Liquidity Simulation Error', { error, payload })
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
          summary: `Add ${amountA} ${symbolA} and ${amountB} ${symbolB}`,
          translatableSummary: {
            text: 'Add %amountA% %symbolA% and %amountB% %symbolB%',
            data: { amountA, symbolA, amountB, symbolB },
          },
          type: 'add-liquidity',
        })
      })
      .catch((err) => {
        log.error('Add Liquidity Error', { error: err, payload })
        console.error(`Add Liquidity failed`, { err }, payload)

        let errorMsg = ''

        if (!(err instanceof UserRejectedRequestError)) {
          errorMsg = t('Add liquidity failed: %message%', {
            message: transactionErrorToUserReadableMessage(err),
          })
        }

        setLiquidityState({
          attemptingTxn: false,
          liquidityErrorMessage: errorMsg,
          txHash: undefined,
        })
      })
  }, [
    currencyA,
    currencyB,
    parsedAAmount?.quotient,
    parsedBAmount?.quotient,
    amountsMin,
    executeTransaction,
    parsedAmounts,
    addTransaction,
    t,
  ])

  return useMemo(
    () => ({
      onAdd,
      attemptingTxn,
      liquidityErrorMessage,
      txHash,
      setLiquidityState,
    }),
    [onAdd, attemptingTxn, liquidityErrorMessage, txHash, setLiquidityState],
  )
}
