import { useMemo } from 'react'
import { useTranslation } from '@pancakeswap/localization'

export const useTokenAmountString = (transactions) => {
  const { t } = useTranslation()

  const tokenAmountStrings = useMemo(() => {
    if (
      !transactions ||
      transactions.length === 0 ||
      transactions.some((transaction) => transaction.token0Symbol !== transactions[0].token0Symbol)
    ) {
      return [t('Token Amount'), t('Token Amount')]
    }
    return [
      t('%symbol% Amount', { symbol: transactions[0].token0Symbol }),
      t('%symbol% Amount', { symbol: transactions[0].token1Symbol }),
    ]
  }, [transactions, t])

  return tokenAmountStrings
}
