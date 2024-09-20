import { BIG_ONE, BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { encodeSqrtRatioX96, FeeAmount, FeeCalculator, isPoolTickInRange, parseProtocolFees } from '@pancakeswap/v3-sdk'
import { useAmountsByUsdValue, useRoi } from '@pancakeswap/widgets-internal/roi'
import BigNumber from 'bignumber.js'
import { useCakePrice } from 'hooks/useCakePrice'
import { useCurrencyUsdPrice } from 'hooks/useCurrencyUsdPrice'
import useV3DerivedInfo from 'hooks/v3/useV3DerivedInfo'
import { useEffect, useMemo } from 'react'
import { useExtraV3PositionInfo, usePoolApr } from 'state/farmsV4/hooks'
import { PositionDetail, StableLPDetail, V2LPDetail } from 'state/farmsV4/state/accountPositions/type'
import { PoolInfo } from 'state/farmsV4/state/type'
import { useV3FormState } from 'views/AddLiquidityV3/formViews/V3FormView/form/reducer'
import { useLmPoolLiquidity } from 'views/Farms/hooks/useLmPoolLiquidity'
import { useMyPositions } from 'views/PoolDetail/components/MyPositionsContext'
import { useEstimateUserMultiplier } from 'views/universalFarms/hooks/useEstimateUserMultiplier'
import { formatPercent } from '@pancakeswap/utils/formatFractions'
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
  inverted?: boolean
}

export const V2PoolPositionAprButton: React.FC<PoolPositionAprButtonProps<StableLPDetail | V2LPDetail>> = ({
  pool,
  userPosition,
}) => {
  const { lpApr, cakeApr, merklApr, numerator, denominator } = useV2PositionApr(pool, userPosition)
  const { updateTotalApr } = useMyPositions()

  useEffect(() => {
    if (!numerator.isZero())
      updateTotalApr(`${pool.chainId}:${pool.lpAddress}:${userPosition.isStaked}`, numerator, denominator)
  }, [denominator, numerator, pool.chainId, pool.lpAddress, updateTotalApr, userPosition.isStaked])

  return <PoolAprButton pool={pool} lpApr={lpApr} cakeApr={cakeApr} merklApr={merklApr} />
}

export const V3PoolPositionAprButton: React.FC<PoolPositionAprButtonProps<PositionDetail>> = ({
  pool,
  userPosition,
}) => {
  const { lpApr, cakeApr, merklApr, numerator, denominator } = useV3PositionApr(pool, userPosition)
  const { updateTotalApr } = useMyPositions()

  useEffect(() => {
    if (!numerator.isZero())
      updateTotalApr(`${pool.chainId}:${pool.lpAddress}:${userPosition.tokenId}`, numerator, denominator)
  }, [denominator, numerator, pool.chainId, pool.lpAddress, updateTotalApr, userPosition.tokenId])

  return <PoolAprButton pool={pool} lpApr={lpApr} cakeApr={cakeApr} merklApr={merklApr} userPosition={userPosition} />
}

export const V3PoolDerivedAprButton: React.FC<Omit<PoolPositionAprButtonProps<PositionDetail>, 'userPosition'>> = ({
  pool,
  inverted,
}) => {
  const { lpApr, cakeApr, merklApr } = useV3FormDerivedApr(pool, inverted)

  return <PoolAprButton pool={pool} lpApr={lpApr} cakeApr={cakeApr} merklApr={merklApr} />
}

export const useV2PositionApr = (pool: PoolInfo, userPosition: StableLPDetail | V2LPDetail) => {
  const key = useMemo(() => `${pool?.chainId}:${pool?.lpAddress}` as const, [pool?.chainId, pool?.lpAddress])
  const { lpApr: globalLpApr, cakeApr: globalCakeApr, merklApr } = usePoolApr(key, pool)
  const numerator = useMemo(() => {
    const lpAprNumerator = new BigNumber(globalLpApr).times(globalCakeApr?.userTvlUsd ?? BIG_ZERO)
    const othersNumerator = new BigNumber(globalCakeApr?.value ?? 0)
      .times(userPosition.farmingBoosterMultiplier)
      .plus(merklApr)
      .times(globalCakeApr?.userTvlUsd ?? BIG_ZERO)
    return userPosition.isStaked ? lpAprNumerator.plus(othersNumerator) : lpAprNumerator
  }, [
    globalCakeApr?.userTvlUsd,
    globalCakeApr?.value,
    globalLpApr,
    userPosition.farmingBoosterMultiplier,
    userPosition.isStaked,
    merklApr,
  ])

  const denominator = useMemo(() => {
    return globalCakeApr?.userTvlUsd ?? BIG_ZERO
  }, [globalCakeApr?.userTvlUsd])

  return {
    lpApr: parseFloat(globalLpApr) ?? 0,
    numerator,
    denominator,
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
  const { data: estimateUserMultiplier } = useEstimateUserMultiplier(pool.chainId, userPosition.tokenId)
  const { removed, outOfRange, position } = useExtraV3PositionInfo(userPosition)
  const { cakeApr: globalCakeApr, merklApr: merklApr_ } = usePoolApr(key, pool)
  const lmPoolLiquidity = useLmPoolLiquidity(pool.lpAddress, pool.chainId)
  const { data: token0UsdPrice_ } = useCurrencyUsdPrice(pool.token0)
  const { data: token1UsdPrice_ } = useCurrencyUsdPrice(pool.token1)

  const [token0UsdPrice, token1UsdPrice] = useMemo(() => {
    if (token0UsdPrice_ && token1UsdPrice_) return [token0UsdPrice_, token1UsdPrice_]
    if (token0UsdPrice_ && !token1UsdPrice_)
      return [token0UsdPrice_, parseFloat(pool?.token0Price ?? '0') * token0UsdPrice_]
    if (!token0UsdPrice_ && token1UsdPrice_)
      return [parseFloat(pool?.token1Price ?? '0') * token1UsdPrice_, token1UsdPrice_]
    return [token0UsdPrice_, token1UsdPrice_]
  }, [pool?.token0Price, pool?.token1Price, token0UsdPrice_, token1UsdPrice_])

  const cakePrice = useCakePrice()

  const userTVLUsd = useMemo(() => {
    return position?.amount0 && position?.amount1 && token0UsdPrice && token1UsdPrice
      ? new BigNumber(position.amount0.toExact())
          .times(token0UsdPrice)
          .plus(new BigNumber(position.amount1.toExact()).times(token1UsdPrice))
      : BIG_ZERO
  }, [position?.amount0, position?.amount1, token0UsdPrice, token1UsdPrice])

  const cakeApr = useMemo(() => {
    if (outOfRange || removed || globalCakeApr.poolWeight?.isZero()) {
      return {
        ...globalCakeApr,
        value: '0' as const,
        boost: undefined,
      }
    }

    if (userPosition.isStaked) {
      const apr =
        lmPoolLiquidity && !userTVLUsd.isZero()
          ? new BigNumber(globalCakeApr.cakePerYear ?? 0)
              .times(globalCakeApr.poolWeight ?? 0)
              .times(cakePrice)
              .times(
                new BigNumber(userPosition.farmingLiquidity.toString()).dividedBy(lmPoolLiquidity?.toString() ?? 1),
              )
              .div(userTVLUsd)
              .times(userPosition.farmingMultiplier)
          : BIG_ZERO

      return {
        ...globalCakeApr,
        value: apr.toString() as `${number}`,
        boost: undefined,
      }
    }

    const baseApr =
      lmPoolLiquidity && !userTVLUsd.isZero()
        ? new BigNumber(globalCakeApr.cakePerYear ?? 0)
            .times(globalCakeApr.poolWeight ?? 0)
            .times(cakePrice)
            .times(
              new BigNumber(userPosition.liquidity.toString()).dividedBy(
                lmPoolLiquidity?.toString() ?? pool.liquidity?.toString() ?? 1,
              ),
            )
            .div(userTVLUsd)
        : BIG_ZERO

    const apr = baseApr.times(estimateUserMultiplier || 1)

    return {
      ...globalCakeApr,
      value: apr.toString() as `${number}`,
      boost: undefined,
    }
  }, [
    outOfRange,
    removed,
    globalCakeApr,
    userPosition.isStaked,
    userPosition.liquidity,
    userPosition.farmingLiquidity,
    userPosition.farmingMultiplier,
    lmPoolLiquidity,
    cakePrice,
    pool.liquidity,
    userTVLUsd,
    estimateUserMultiplier,
  ])

  const lpApr = useMemo(() => {
    if (outOfRange || removed || userTVLUsd.isZero()) return 0
    const apr = new BigNumber(pool.fee24hUsd ?? 0)
      .times(365)
      .times(V3_LP_FEE_RATE[pool.feeTier] ?? 1)
      .times(new BigNumber(userPosition.liquidity.toString()).dividedBy(pool.liquidity?.toString() ?? 1))
      .div(userTVLUsd)
      .toNumber()
    return apr
  }, [outOfRange, pool.fee24hUsd, pool.feeTier, pool.liquidity, removed, userPosition.liquidity, userTVLUsd])
  const merklApr = outOfRange ? 0 : parseFloat(merklApr_ ?? 0) ?? 0

  const numerator = useMemo(() => {
    if (outOfRange || removed) return BIG_ZERO
    return BigNumber(lpApr)
      .plus(userPosition.isStaked ? cakeApr.boost ?? cakeApr.value : BIG_ZERO)
      .plus(parseFloat(cakeApr.value) > 0 ? merklApr : 0)
      .times(userTVLUsd)
  }, [cakeApr.boost, cakeApr.value, lpApr, merklApr, outOfRange, removed, userPosition.isStaked, userTVLUsd])
  const denominator = userTVLUsd

  return {
    denominator,
    numerator,
    lpApr,
    cakeApr,
    merklApr,
  }
}

export const useV3FormDerivedApr = (pool: PoolInfo, inverted?: boolean) => {
  const key = useMemo(() => `${pool.chainId}:${pool.lpAddress}` as const, [pool.chainId, pool.lpAddress])
  const formState = useV3FormState()
  // const { data: estimateUserMultiplier } = useEstimateUserMultiplier(pool.chainId, userPosition.tokenId)
  // const { removed, outOfRange, position } = useExtraV3PositionInfo(userPosition)

  const [token0, token1] = useMemo(() => {
    if (inverted) {
      return [pool.token1, pool.token0]
    }
    return [pool.token0, pool.token1]
  }, [pool, inverted])

  const { cakeApr: globalCakeApr, merklApr } = usePoolApr(key, pool)
  const lmPoolLiquidity = useLmPoolLiquidity(pool.lpAddress, pool.chainId)
  const { data: token0UsdPrice } = useCurrencyUsdPrice(token0)
  const { data: token1UsdPrice } = useCurrencyUsdPrice(token1)
  const {
    pool: _pool,
    ticks,
    price,
    pricesAtTicks,
    parsedAmounts,
  } = useV3DerivedInfo(token0, token1, pool.feeTier, token0, undefined, formState)
  const sqrtRatioX96 = useMemo(() => price && encodeSqrtRatioX96(price.numerator, price.denominator), [price])

  const { amountA: aprAmountA, amountB: aprAmountB } = useAmountsByUsdValue({
    usdValue: '1',
    currencyA: token0,
    currencyB: token1,
    price,
    priceLower: pricesAtTicks.LOWER,
    priceUpper: pricesAtTicks.UPPER,
    sqrtRatioX96,
    currencyAUsdPrice: token0UsdPrice,
    currencyBUsdPrice: token1UsdPrice,
  })
  const amountA = useMemo(() => {
    return parsedAmounts.CURRENCY_A || aprAmountA
  }, [aprAmountA, parsedAmounts.CURRENCY_A])
  const amountB = useMemo(() => {
    return parsedAmounts.CURRENCY_B || aprAmountB
  }, [aprAmountB, parsedAmounts.CURRENCY_B])
  const liquidity = useMemo(() => {
    if (!amountA || !amountB || !sqrtRatioX96 || typeof ticks.LOWER !== 'number' || typeof ticks.UPPER !== 'number')
      return 0n
    const amount0 = amountA.toExact()
    const amount1 = amountB.toExact()
    if (!amount0 || !amount1) return 0n

    return (
      FeeCalculator.getLiquidityByAmountsAndPrice({
        amountA,
        amountB,
        tickLower: ticks.LOWER,
        tickUpper: ticks.UPPER,
        sqrtRatioX96,
      }) ?? 0n
    )
  }, [amountA, amountB, sqrtRatioX96, ticks.LOWER, ticks.UPPER])
  const inRange = useMemo(() => isPoolTickInRange(_pool, ticks.LOWER, ticks.UPPER), [_pool, ticks.LOWER, ticks.UPPER])

  const cakePrice = useCakePrice()

  const userTVLUsd = useMemo(() => {
    return parsedAmounts.CURRENCY_A && parsedAmounts.CURRENCY_B && token0UsdPrice && token1UsdPrice
      ? new BigNumber(parsedAmounts.CURRENCY_A.toExact())
          .times(token0UsdPrice)
          .plus(new BigNumber(parsedAmounts.CURRENCY_B.toExact()).times(token1UsdPrice))
      : BIG_ONE
  }, [parsedAmounts.CURRENCY_A, parsedAmounts.CURRENCY_B, token0UsdPrice, token1UsdPrice])

  const cakeApr = useMemo(() => {
    if (!inRange) {
      return {
        ...globalCakeApr,
        value: '0' as const,
        boost: undefined,
      }
    }

    const baseApr = lmPoolLiquidity
      ? new BigNumber(globalCakeApr.cakePerYear ?? 0)
          .times(globalCakeApr.poolWeight ?? 0)
          .times(cakePrice)
          .times(new BigNumber(liquidity.toString()).dividedBy(lmPoolLiquidity?.toString() ?? 1))
          .div(userTVLUsd)
      : BIG_ZERO
    // const apr = baseApr.times(estimateUserMultiplier ?? 0)

    return {
      ...globalCakeApr,
      value: baseApr.toString() as `${number}`,
      boost: undefined,
    }
  }, [inRange, globalCakeApr, cakePrice, liquidity, lmPoolLiquidity, userTVLUsd])

  const [protocolFee] = useMemo(
    () => (_pool?.feeProtocol && parseProtocolFees(_pool.feeProtocol)) || [],
    [_pool?.feeProtocol],
  )

  const { apr } = useRoi({
    amountA,
    amountB,
    currencyAUsdPrice: token0UsdPrice,
    currencyBUsdPrice: token1UsdPrice,
    tickLower: ticks?.LOWER,
    tickUpper: ticks?.UPPER,
    volume24H: pool?.vol24hUsd && parseFloat(pool?.vol24hUsd),
    sqrtRatioX96,
    mostActiveLiquidity: _pool?.liquidity,
    fee: pool?.feeTier,
    protocolFee,
  })

  return {
    lpApr: parseFloat(`${formatPercent(apr, 5) || '0'}`) / 100,
    cakeApr,
    merklApr: inRange ? parseFloat(merklApr ?? 0) ?? 0 : 0,
  }
}
