import { Currency } from '@pancakeswap/sdk'

import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { YEAR_IN_SECONDS } from '@pancakeswap/utils/getTimePeriods'
import BigNumber from 'bignumber.js'
import { useCurrencyUsdPrice } from 'hooks/useCurrencyUsdPrice'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useTotalStakedInUsd } from 'views/PositionManagers/hooks/useTotalStakedInUsd'
import { useBoosterLiquidityX } from './useBoostedLiquidityX'

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
  rewardEndTime: number
  rewardStartTime: number
  farmRewardAmount?: number
  adapterAddress?: Address
  bCakeWrapperAddress?: Address
}

export interface AprResult {
  combinedApr: string
  lpApr: string
  cakeYieldApr: string
  isInCakeRewardDateRange: boolean
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
  rewardEndTime,
  rewardStartTime,
  farmRewardAmount,
  adapterAddress,
  bCakeWrapperAddress,
}: AprProps): AprResult => {
  const { data: rewardUsdPrice } = useCurrencyUsdPrice(earningToken ?? undefined)
  const { boostedLiquidityX } = useBoosterLiquidityX(bCakeWrapperAddress, adapterAddress)

  const isInCakeRewardDateRange = useMemo(
    // () =>  true // mock cake in range to see the booster changes
    () => Date.now() / 1000 < rewardEndTime && Date.now() / 1000 >= rewardStartTime,
    [rewardEndTime, rewardStartTime],
  )

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
    const cakeRewardUsd = getBalanceAmount(new BigNumber(farmRewardAmount ?? 0), 18).times(rewardUsdPrice ?? 0)

    const totalAvgStakedInUsd = totalToken0Usd.plus(totalToken1Usd).plus(cakeRewardUsd)
    return totalAvgStakedInUsd.times(ONE_YEAR).div(totalStakedInUsd).times(100)
  }, [
    avgToken0Amount,
    avgToken1Amount,
    currencyA,
    currencyB,
    token0PriceUSD,
    token1PriceUSD,
    totalStakedInUsd,
    farmRewardAmount,
    rewardUsdPrice,
  ])

  const cakeYieldApr = useMemo(() => {
    if (!isInCakeRewardDateRange) {
      return BIG_ZERO
    }

    return getBalanceAmount(new BigNumber(rewardPerSecond), earningToken.decimals)
      .times(YEAR_IN_SECONDS)
      .times(rewardUsdPrice ?? 0)
      .div(totalStakedInUsd * (boostedLiquidityX ?? 1))
      .times(100)
  }, [isInCakeRewardDateRange, earningToken, rewardPerSecond, rewardUsdPrice, totalStakedInUsd, boostedLiquidityX])

  const totalApr = useMemo(() => cakeYieldApr.plus(totalLpApr), [cakeYieldApr, totalLpApr])

  const aprData = useMemo(() => {
    return {
      combinedApr: !totalApr.isNaN() ? totalApr.toFixed(2) ?? '-' : '0.00',
      lpApr: !totalLpApr.isNaN() ? totalLpApr.toFixed(2) ?? '-' : '0.00',
      cakeYieldApr: !cakeYieldApr.isNaN() ? cakeYieldApr.toFixed(2) ?? '-' : '0.00',
      isInCakeRewardDateRange,
    }
  }, [totalApr, totalLpApr, cakeYieldApr, isInCakeRewardDateRange])

  return aprData
}
