import { useMemo } from 'react'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'

export const useTotalAssetInSingleDepositTokenAmount = (
  singleDepositTokenAmount?: CurrencyAmount<Currency>,
  ohterTokenAmount?: CurrencyAmount<Currency>,
  singleDepositTokenPriceUSD?: number,
  ohterTokenPriceUSD?: number,
) => {
  const totalAssetInSingleDepositTokenAmount = useMemo(() => {
    const singleDepositTokenAmountBigNum = new BigNumber(formatAmount(singleDepositTokenAmount) ?? BIG_ZERO)
    const singleDepositTokenPriceUSDBigNum = new BigNumber(singleDepositTokenPriceUSD ?? BIG_ZERO)
    const otherTokenAmountBigNum = new BigNumber(formatAmount(ohterTokenAmount) ?? BIG_ZERO)
    const ohterTokenPriceUSDBigNum = new BigNumber(ohterTokenPriceUSD ?? BIG_ZERO)

    return singleDepositTokenAmountBigNum.plus(
      otherTokenAmountBigNum.times(ohterTokenPriceUSDBigNum).div(singleDepositTokenPriceUSDBigNum),
    )
  }, [ohterTokenAmount, singleDepositTokenAmount, ohterTokenPriceUSD, singleDepositTokenPriceUSD])
  return totalAssetInSingleDepositTokenAmount
}
