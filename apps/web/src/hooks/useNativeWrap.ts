import { useTranslation } from '@pancakeswap/localization'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { Hash, formatUnits } from 'viem'
import useAccountActiveChain from './useAccountActiveChain'
import { useCallWithGasPrice } from './useCallWithGasPrice'
import { useWNativeContract } from './useContract'
import useNativeCurrency from './useNativeCurrency'

export const useNativeWrap = () => {
  const { t } = useTranslation()
  const wnative = useWNativeContract()
  const nativeCurrency = useNativeCurrency()
  const { account } = useAccountActiveChain()
  const { callWithGasPrice } = useCallWithGasPrice()
  const addTransaction = useTransactionAdder()
  const balance = useCurrencyBalance(account ?? undefined, nativeCurrency)
  return useCallback(
    async (amount: bigint): Promise<{ hash: Hash } | null> => {
      if (!wnative || amount <= 0n) return null

      if (!balance || balance.lessThan(amount)) {
        throw new Error(t('Insufficient %symbol% balance', { symbol: nativeCurrency.symbol }))
      }

      const amtIn = formatUnits(amount, nativeCurrency.decimals)

      const tx = await callWithGasPrice(wnative, 'deposit', undefined, { value: amount })
      addTransaction(tx, {
        summary: `Wrap ${amtIn} ${nativeCurrency.symbol} to ${nativeCurrency.wrapped.symbol}`,
        translatableSummary: {
          text: 'Wrap %amount% %native% to %wrap%',
          data: { amount: amtIn, native: nativeCurrency.symbol, wrap: nativeCurrency.wrapped.symbol },
        },
        type: 'wrap',
      })

      return tx
    },
    [
      addTransaction,
      balance,
      callWithGasPrice,
      nativeCurrency.decimals,
      nativeCurrency.symbol,
      nativeCurrency.wrapped.symbol,
      t,
      wnative,
    ],
  )
}
