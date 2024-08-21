import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import BigNumber from 'bignumber.js'
import { useCakePrice } from 'hooks/useCakePrice'
import { useCurrencyUsdPrice } from 'hooks/useCurrencyUsdPrice'
import { useMemo } from 'react'
import { useExtraV3PositionInfo, usePoolApr } from 'state/farmsV4/hooks'
import { PositionDetail, StableLPDetail, V2LPDetail } from 'state/farmsV4/state/accountPositions/type'
import { PoolInfo } from 'state/farmsV4/state/type'
import { useLmPoolLiquidity } from 'views/Farms/hooks/useLmPoolLiquidity'
import { PoolAprButton } from './PoolAprButton'

const V3_LP_FEE_RATE = {
  [FeeAmount.LOWEST]: 0.67,
  [FeeAmount.LOW]: 0.66,
  [FeeAmount.MEDIUM]: 0.68,
  [FeeAmount.HIGH]: 0.68,
}

type PoolPositionAprButtonProps<TPosition> = {
  pool: PoolInfo
  userPosition: TPosition
}

export const V2PoolPositionAprButton: React.FC<PoolPositionAprButtonProps<StableLPDetail | V2LPDetail>> = ({
  pool,
  userPosition,
}) => {
  const { lpApr, cakeApr, merklApr } = useV2PositionApr(pool, userPosition)

  return <PoolAprButton pool={pool} lpApr={lpApr} cakeApr={cakeApr} merklApr={merklApr} />
}

export const V3PoolPositionAprButton: React.FC<PoolPositionAprButtonProps<PositionDetail>> = ({
  pool,
  userPosition,
}) => {
  const { lpApr, cakeApr, merklApr } = useV3PositionApr(pool, userPosition)

  return <PoolAprButton pool={pool} lpApr={lpApr} cakeApr={cakeApr} merklApr={merklApr} userPosition={userPosition} />
}

export const useV2PositionApr = (pool: PoolInfo, userPosition: StableLPDetail | V2LPDetail) => {
  const key = useMemo(() => `${pool?.chainId}:${pool?.lpAddress}` as const, [pool?.chainId, pool?.lpAddress])
  const { lpApr: globalLpApr, cakeApr: globalCakeApr, merklApr } = usePoolApr(key, pool)

  return {
    lpApr: parseFloat(globalLpApr) ?? 0,
    cakeApr: {
      ...globalCakeApr,
      value: String(parseFloat(globalCakeApr?.value) * userPosition.farmingBoosterMultiplier) as `${number}`,
      boost: undefined,
    },
    merklApr: parseFloat(merklApr ?? 0) ?? 0,
  }
}

export const useV3PositionApr = (pool: PoolInfo, userPosition: PositionDetail) => {
  const key = useMemo(() => `${pool.chainId}:${pool.lpAddress}` as const, [pool.chainId, pool.lpAddress])
  const { removed, outOfRange, position } = useExtraV3PositionInfo(userPosition)
  const { cakeApr: globalCakeApr, merklApr } = usePoolApr(key, pool)
  const lmPoolLiquidity = useLmPoolLiquidity(pool.lpAddress, pool.chainId)
  const { data: token0UsdPrice } = useCurrencyUsdPrice(pool.token0)
  const { data: token1UsdPrice } = useCurrencyUsdPrice(pool.token1)

  const cakePrice = useCakePrice()

  const userTVLUsd = useMemo(() => {
    return position?.amount0 && position?.amount1 && token0UsdPrice && token1UsdPrice
      ? new BigNumber(position.amount0.toExact())
          .times(token0UsdPrice)
          .plus(new BigNumber(position.amount1.toExact()).times(token1UsdPrice))
      : BIG_ZERO
  }, [position?.amount0, position?.amount1, token0UsdPrice, token1UsdPrice])

  const cakeApr = useMemo(() => {
    if (outOfRange || removed || !userPosition.isStaked) {
      return {
        ...globalCakeApr,
        value: '0' as const,
        boost: undefined,
      }
    }
    if (userPosition.isStaked) {
      const apr = new BigNumber(globalCakeApr.cakePerYear ?? 0)
        .times(globalCakeApr.poolWeight ?? 0)
        .times(cakePrice)
        .times(new BigNumber(userPosition.farmingLiquidity.toString()).dividedBy(lmPoolLiquidity?.toString() ?? 1))
        .div(userTVLUsd)

      return {
        ...globalCakeApr,
        value: apr.toString() as `${number}`,
        boost: undefined,
      }
    }
    return globalCakeApr
  }, [
    cakePrice,
    globalCakeApr,
    lmPoolLiquidity,
    outOfRange,
    removed,
    userPosition.farmingLiquidity,
    userPosition.isStaked,
    userTVLUsd,
  ])

  const lpApr = useMemo(() => {
    if (outOfRange || removed) return 0
    const apr = new BigNumber(pool.fee24hUsd ?? 0)
      .times(365)
      .times(V3_LP_FEE_RATE[pool.feeTier] ?? 1)
      .times(new BigNumber(userPosition.liquidity.toString()).dividedBy(pool.liquidity?.toString() ?? 1))
      .div(userTVLUsd)
      .toNumber()
    return apr
  }, [outOfRange, pool.fee24hUsd, pool.feeTier, pool.liquidity, removed, userPosition.liquidity, userTVLUsd])

  return {
    lpApr,
    cakeApr,
    merklApr: outOfRange ? 0 : parseFloat(merklApr ?? 0) ?? 0,
  }
}
