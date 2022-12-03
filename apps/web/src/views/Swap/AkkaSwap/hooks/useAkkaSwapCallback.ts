import { useMemo } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useAkkaRouterContract } from 'utils/exchange'
import { AkkaRouterTrade } from './types'
import { useWeb3React } from '@pancakeswap/wagmi'
import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'
import { useTranslation } from '@pancakeswap/localization'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
export function useAkkaRouterSwapCallback(trade: AkkaRouterTrade): {
  multiPathSwap: () => Promise<string>
} {
  const akkaContract = useAkkaRouterContract()
  const { callWithGasPrice } = useCallWithGasPrice()
  const addTransaction = useTransactionAdder()

  const { account } = useWeb3React()

  const { t } = useTranslation()


  const { args } = trade

  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()

  return useMemo(() => {
    const methodName = 'multiPathSwap'
    return {
      multiPathSwap: args ? async () => {
        const tx = await callWithGasPrice(
          akkaContract,
          methodName,
          [
            args.amountIn,
            args.amountOutMin,
            args.data,
            args.bridge,
            args.dstData,
            account
          ],
          {
            value: inputCurrencyId === 'BRISE' ? args.amountIn : '',
          }
        )
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error('Transaction rejected.')
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, methodName, args)
              throw new Error(t('Swap failed: %message%', { message: transactionErrorToUserReadableMessage(error, t) }))
            }
          })
        addTransaction(tx, {
          summary: `swap`,
          type: 'swap',
        })
        return tx?.hash
      } : null,
    }
  }, [trade, akkaContract, addTransaction])
}
