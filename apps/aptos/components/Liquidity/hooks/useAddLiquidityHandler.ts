import { AptosSwapRouter } from '@pancakeswap/aptos-swap-sdk'

import { useContext, useState } from 'react'
import { Field } from 'state/mint'
import { useTranslation } from '@pancakeswap/localization'

import { useSendTransaction, useSimulateTransaction } from '@pancakeswap/awgmi'

import { useTransactionAdder } from 'state/transactions/hooks'
import { usePairAdder } from 'state/user'
import { CurrencySelectorContext } from './useCurrencySelectRoute'
import { MintPairContext } from './useMintPair'

export default function useAddLiquidityHanlder({ parsedAmounts }) {
  const { currencyA, currencyB } = useContext(CurrencySelectorContext)
  const { pair } = useContext(MintPairContext)
  const { t } = useTranslation()
  const addTransaction = useTransactionAdder()
  const { simulateTransactionAsync } = useSimulateTransaction()
  const { sendTransactionAsync } = useSendTransaction()
  const addPair = usePairAdder()

  const [{ attemptingTxn, liquidityErrorMessage, txHash }, setLiquidityState] = useState<{
    attemptingTxn: boolean
    liquidityErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    attemptingTxn: false,
    liquidityErrorMessage: undefined,
    txHash: undefined,
  })

  async function onAdd() {
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

  return {
    onAdd,
    attemptingTxn,
    liquidityErrorMessage,
    txHash,
    setLiquidityState,
  }
}
