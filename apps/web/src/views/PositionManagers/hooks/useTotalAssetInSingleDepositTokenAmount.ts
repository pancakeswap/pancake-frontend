import { useMemo } from 'react'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'

export const useTotalAssetInSingleDepositTokenAmount = (
  singleDepositTokenAmount?: CurrencyAmount<Currency>,
  ohterTokenAmount?: CurrencyAmount<Currency>,
  singleDepositTokenPriceUSD?: number,
  ohterTokenPriceUSD?: number,
) => {
  const totalAssetInStaked1TokenAmount = useMemo(() => {
    return (
      Number(formatAmount(singleDepositTokenAmount) ?? 0) +
      (Number(formatAmount(ohterTokenAmount) ?? 0) * (ohterTokenPriceUSD ?? 0)) / (singleDepositTokenPriceUSD ?? 0)
    )
  }, [ohterTokenAmount, singleDepositTokenAmount, ohterTokenPriceUSD, singleDepositTokenPriceUSD])
  return totalAssetInStaked1TokenAmount
}
