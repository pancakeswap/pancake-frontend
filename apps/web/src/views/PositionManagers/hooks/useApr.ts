import { useMemo } from 'react'
import { Currency } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { useTotalStakedInUsd } from 'views/PositionManagers/hooks/useTotalStakedInUsd'

interface AprProps {
  currencyA: Currency
  currencyB: Currency
  avgToken0Amount: number
  avgToken1Amount: number
  poolToken0Amount?: bigint
  poolToken1Amount?: bigint
  token0PriceUSD?: number
  token1PriceUSD?: number
}

const ONE_YEAR = 365

export const useApr = ({
  currencyA,
  currencyB,
  poolToken0Amount,
  poolToken1Amount,
  token0PriceUSD,
  token1PriceUSD,
  avgToken0Amount,
  avgToken1Amount,
}: AprProps): string => {
  const totalStakedInUsd = useTotalStakedInUsd({
    currencyA,
    currencyB,
    poolToken0Amount,
    poolToken1Amount,
    token0PriceUSD,
    token1PriceUSD,
  })

  const totalAvgStakedInUsd = useMemo(() => {
    const totalToken0Usd = getBalanceAmount(new BigNumber(avgToken0Amount), currencyA.decimals).times(
      token0PriceUSD ?? 0,
    )
    const totalToken1Usd = getBalanceAmount(new BigNumber(avgToken1Amount), currencyB.decimals).times(
      token1PriceUSD ?? 0,
    )
    return totalToken0Usd.plus(totalToken1Usd)
  }, [avgToken0Amount, avgToken1Amount, currencyA, currencyB, token0PriceUSD, token1PriceUSD])

  const totalApr = useMemo(
    () => totalAvgStakedInUsd.times(ONE_YEAR).div(totalStakedInUsd).times(100).toFixed(2),
    [totalAvgStakedInUsd, totalStakedInUsd],
  )

  return totalApr ?? '-'
}
