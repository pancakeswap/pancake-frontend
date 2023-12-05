import { useMemo } from 'react'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'

export const useTotalAssetInSingleDepositTokenAmount = (
  singleDepositTokenAmount?: CurrencyAmount<Currency>,
  ohterTokenAmount?: CurrencyAmount<Currency>,
  singleDepositTokenPriceUSD?: number,
  ohterTokenPriceUSD?: number,
) => {
  const singleDepositTokenInfo = useMemo(() => {
    const tokenAmount = new BigNumber(formatAmount(singleDepositTokenAmount) ?? 0)
    const tokenPriceUSD = new BigNumber(singleDepositTokenPriceUSD ?? 0)

    return {
      tokenAmount,
      tokenPriceUSD,
    }
  }, [singleDepositTokenAmount, singleDepositTokenPriceUSD])

  const otherTokenInfo = useMemo(() => {
    const tokenAmount = new BigNumber(formatAmount(ohterTokenAmount) ?? 0)
    const tokenPriceUSD = new BigNumber(ohterTokenPriceUSD ?? 0)

    return {
      tokenAmount,
      tokenPriceUSD,
    }
  }, [ohterTokenAmount, ohterTokenPriceUSD])

  const totalAssetInSingleDepositTokenAmount = useMemo(() => {
    return singleDepositTokenInfo.tokenAmount.plus(
      otherTokenInfo.tokenAmount.times(otherTokenInfo.tokenPriceUSD).div(singleDepositTokenInfo.tokenPriceUSD),
    )
  }, [singleDepositTokenInfo, otherTokenInfo])
  return totalAssetInSingleDepositTokenAmount
}
