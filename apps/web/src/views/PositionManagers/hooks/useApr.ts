import { useMemo } from 'react'
import { Currency } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { useTotalStakedInUsd } from 'views/PositionManagers/hooks/useTotalStakedInUsd'
import { YEAR_IN_SECONDS } from '@pancakeswap/utils/getTimePeriods'
import { useCakePrice } from 'hooks/useCakePrice'

interface AprProps {
  currencyA: Currency
  currencyB: Currency
  rewardPerSecond: string
  avgToken0Amount: number
  avgToken1Amount: number
  poolToken0Amount?: bigint
  poolToken1Amount?: bigint
  token0PriceUSD?: number
  token1PriceUSD?: number
  earningToken: Currency
}

const ONE_YEAR = 365

export const useApr = ({
  currencyA,
  currencyB,
  rewardPerSecond,
  poolToken0Amount,
  poolToken1Amount,
  token0PriceUSD,
  token1PriceUSD,
  avgToken0Amount,
  avgToken1Amount,
  earningToken,
}: AprProps): string => {
  const cakePriceBusd = useCakePrice()

  const totalStakedInUsd = useTotalStakedInUsd({
    currencyA,
    currencyB,
    poolToken0Amount,
    poolToken1Amount,
    token0PriceUSD,
    token1PriceUSD,
  })

  const totalLpApr = useMemo(() => {
    const totalToken0Usd = getBalanceAmount(new BigNumber(avgToken0Amount), currencyA.decimals).times(
      token0PriceUSD ?? 0,
    )
    const totalToken1Usd = getBalanceAmount(new BigNumber(avgToken1Amount), currencyB.decimals).times(
      token1PriceUSD ?? 0,
    )

    const totalAvgStakedInUsd = totalToken0Usd.plus(totalToken1Usd)

    return totalAvgStakedInUsd.times(ONE_YEAR).div(totalStakedInUsd).times(100)
  }, [avgToken0Amount, avgToken1Amount, currencyA, currencyB, token0PriceUSD, token1PriceUSD, totalStakedInUsd])

  const cakeYieldApr = useMemo(() => {
    return getBalanceAmount(new BigNumber(rewardPerSecond), earningToken.decimals)
      .times(YEAR_IN_SECONDS)
      .times(cakePriceBusd)
      .div(totalStakedInUsd)
  }, [earningToken, rewardPerSecond, cakePriceBusd, totalStakedInUsd])

  const totalApr = useMemo(() => cakeYieldApr.plus(totalLpApr), [cakeYieldApr, totalLpApr])

  console.log({
    totalStakedInUsd: totalStakedInUsd.toString(),
    totalLpApr: totalLpApr.toString(),
    poolToken0Amount: poolToken0Amount?.toString(),
    poolToken1Amount: poolToken1Amount?.toString(),
    apiToken0: avgToken0Amount.toString(),
    apiToken1: avgToken1Amount.toString(),
    cakePriceBusd: cakePriceBusd.toString(),
    ONE_YEAR,
    oneYearInSec: YEAR_IN_SECONDS,
    rewardPerSecond,
    totalApr: totalApr.toString(),
  })

  return !totalApr.isNaN() ? totalApr.toFixed(2) ?? '-' : ''
}
