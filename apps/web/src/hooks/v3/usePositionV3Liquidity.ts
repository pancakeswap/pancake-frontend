import { Currency, CurrencyAmount, Token } from '@pancakeswap/sdk'
import { FeeAmount, Position } from '@pancakeswap/v3-sdk'
import useBUSDPrice from 'hooks/useBUSDPrice'
import { useMemo } from 'react'
import { PositionDetails } from '@pancakeswap/farms'
import { usePool } from './usePools'

export function usePositionV3Liquidity(position: Position) {
  const token0 = position?.pool?.token0
  const token1 = position?.pool?.token1

  const price0 = useBUSDPrice(token0 ?? undefined)
  const price1 = useBUSDPrice(token1 ?? undefined)

  const fiatValueOfLiquidity: CurrencyAmount<Currency> | null = useMemo(() => {
    if (!price0 || !price1 || !position) return null
    const amount0 = price0.quote(position.amount0)
    const amount1 = price1.quote(position.amount1)
    return amount0.add(amount1)
  }, [price0, price1, position])

  return fiatValueOfLiquidity
}

interface LiquidityTotalHookProps {
  token0: Token
  token1: Token
  feeAmount: FeeAmount
  positionsDetailsList: PositionDetails[]
}

export function useV3LiquidityTotal({
  token0,
  token1,
  feeAmount,
  positionsDetailsList,
}: LiquidityTotalHookProps): CurrencyAmount<Currency> | null {
  const [, pool] = usePool(token0 ?? undefined, token1 ?? undefined, feeAmount)
  const positions = useMemo(() => {
    return positionsDetailsList.map(({ liquidity, tickLower, tickUpper }) => {
      if (pool && liquidity && typeof tickLower === 'number' && typeof tickUpper === 'number') {
        return new Position({ pool, liquidity: liquidity.toString(), tickLower, tickUpper })
      }

      return undefined
    })
  }, [positionsDetailsList, pool])

  const price0 = useBUSDPrice(token0 ?? undefined)
  const price1 = useBUSDPrice(token1 ?? undefined)

  return useMemo(() => {
    if (!price0 || !price1) return null

    const liqArr = positions.map((position) => {
      const amount0 = price0.quote(position.amount0)
      const amount1 = price1.quote(position.amount1)
      return amount0.add(amount1)
    })

    return liqArr.reduce((sum, liquidity) => (sum ? sum.add(liquidity) : sum))
  }, [positions, price0, price1])
}
