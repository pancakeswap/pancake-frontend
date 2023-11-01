import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'

interface TotalStakedInUsdProps {
  currencyA: Currency
  currencyB: Currency
  poolToken0Amount?: bigint
  poolToken1Amount?: bigint
  token0PriceUSD?: number
  token1PriceUSD?: number
}

export const useTotalStakedInUsd = ({
  currencyA,
  currencyB,
  poolToken0Amount,
  poolToken1Amount,
  token0PriceUSD,
  token1PriceUSD,
}: TotalStakedInUsdProps): number => {
  const pool0Amount = poolToken0Amount ? CurrencyAmount.fromRawAmount(currencyA, poolToken0Amount) : undefined
  const pool1Amount = poolToken1Amount ? CurrencyAmount.fromRawAmount(currencyB, poolToken1Amount) : undefined

  const totalStakedInUsd = useMemo(() => {
    const totalPoolToken0Usd = new BigNumber(pool0Amount?.toSignificant() ?? 0).times(token0PriceUSD ?? 0)
    const totalPoolToken1Usd = new BigNumber(pool1Amount?.toSignificant() ?? 0).times(token1PriceUSD ?? 0)
    return totalPoolToken0Usd.plus(totalPoolToken1Usd).toNumber()
  }, [pool0Amount, pool1Amount, token0PriceUSD, token1PriceUSD])

  return totalStakedInUsd ?? 0
}
