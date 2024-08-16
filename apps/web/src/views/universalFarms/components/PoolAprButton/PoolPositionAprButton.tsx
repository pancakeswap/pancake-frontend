import { encodeSqrtRatioX96 } from '@pancakeswap/v3-sdk'
import { useRoi } from '@pancakeswap/widgets-internal/roi'
import BigNumber from 'bignumber.js'
import { useCurrencyUsdPrice } from 'hooks/useCurrencyUsdPrice'
import { useMemo } from 'react'
import { useExtraV3PositionInfo, usePoolApr } from 'state/farmsV4/hooks'
import { PositionDetail, StableLPDetail, V2LPDetail } from 'state/farmsV4/state/accountPositions/type'
import { PoolInfo } from 'state/farmsV4/state/type'
import { useLmPoolLiquidity } from 'views/Farms/hooks/useLmPoolLiquidity'
import { PoolAprButton } from './PoolAprButton'

type PoolPositionAprButtonProps<TPosition> = {
  pool: PoolInfo
  userPosition: TPosition
}

export const V2PoolPositionAprButton: React.FC<PoolPositionAprButtonProps<StableLPDetail | V2LPDetail>> = ({
  pool,
  userPosition,
}) => {
  const { lpApr, cakeApr, merklApr } = useV2PositionApr(pool, userPosition)

  return (
    <>
      P: {cakeApr?.value}
      <PoolAprButton pool={pool} lpApr={lpApr} cakeApr={cakeApr} merklApr={merklApr} />
    </>
  )
}

export const V3PoolPositionAprButton: React.FC<PoolPositionAprButtonProps<PositionDetail>> = ({
  pool,
  userPosition,
}) => {
  const { lpApr, cakeApr, merklApr } = useV3PositionApr(pool, userPosition)

  return <PoolAprButton pool={pool} lpApr={lpApr} cakeApr={cakeApr} merklApr={merklApr} />
}

export const useV2PositionApr = (pool: PoolInfo, userPosition: StableLPDetail | V2LPDetail) => {
  const key = useMemo(() => `${pool.chainId}:${pool.lpAddress}` as const, [pool.chainId, pool.lpAddress])
  const { lpApr: globalLpApr, cakeApr: globalCakeApr, merklApr } = usePoolApr(key, pool)

  return {
    lpApr: Number(globalLpApr) ?? 0,
    cakeApr: {
      ...globalCakeApr,
      value: String(Number(globalCakeApr.value) * userPosition.farmingBoosterMultiplier) as `${number}`,
      boost: undefined,
    },
    merklApr: Number(merklApr ?? 0) ?? 0,
  }
}

export const useV3PositionApr = (pool: PoolInfo, userPosition: PositionDetail) => {
  const key = useMemo(() => `${pool.chainId}:${pool.lpAddress}` as const, [pool.chainId, pool.lpAddress])
  const { currency0, currency1, removed, outOfRange, price, position } = useExtraV3PositionInfo(userPosition)
  const { lpApr: globalLpApr, cakeApr: globalCakeApr, merklApr } = usePoolApr(key, pool)
  const lmPoolLiquidity = useLmPoolLiquidity(pool.lpAddress, pool.chainId)
  const sqrtPriceX96 = price && encodeSqrtRatioX96(price.numerator, price.denominator)
  const { data: token0UsdPrice } = useCurrencyUsdPrice(pool.token0)
  const { data: token1UsdPrice } = useCurrencyUsdPrice(pool.token1)

  const { apr: userLpApr } = useRoi({
    tickLower: position?.tickLower,
    tickUpper: position?.tickUpper,
    sqrtRatioX96: sqrtPriceX96,
    fee: pool.feeTier,
    mostActiveLiquidity: BigInt(pool?.liquidity ?? 0),
    amountA: position?.amount0,
    amountB: position?.amount1,
    compoundOn: false,
    currencyAUsdPrice: token0UsdPrice,
    currencyBUsdPrice: token1UsdPrice,
    volume24H: Number(pool.vol24hUsd) ?? 0,
    debug: userPosition.tokenId === 261766n,
  })

  const cakeApr = useMemo(() => {
    if (outOfRange || removed || !userPosition.isStaked) {
      return {
        ...globalCakeApr,
        value: '0' as const,
        boost: undefined,
      }
    }
    if (userPosition.isStaked) {
      return {
        ...globalCakeApr,
        value: String(Number(globalCakeApr.value) * userPosition.farmingMultiplier) as `${number}`,
        boost: undefined,
      }
    }
    return globalCakeApr
  }, [globalCakeApr, outOfRange, removed, userPosition.farmingMultiplier, userPosition.isStaked])

  const lpApr = useMemo(() => {
    if (outOfRange || removed) return 0
    // native lp fee apr
    if (!userPosition.isStaked) {
      // return new BigNumber(userLpApr.numerator.toString()).div(userLpApr.denominator.toString()).toNumber()

      return new BigNumber(pool.fee24hUsd ?? 0)
        .times(365)
        .times(100)
        .times(new BigNumber(userPosition.liquidity.toString()).dividedBy(pool.liquidity?.toString() ?? 0))
        .toNumber()
    }
    const apr = new BigNumber(pool.fee24hUsd ?? 0)
      .times(365)
      .times(100)
      .times(new BigNumber(userPosition.farmingLiquidity.toString()).dividedBy(lmPoolLiquidity?.toString() ?? 0))
      .toNumber()
    return apr
  }, [
    lmPoolLiquidity,
    outOfRange,
    pool.fee24hUsd,
    pool.liquidity,
    removed,
    userPosition.farmingLiquidity,
    userPosition.isStaked,
    userPosition.liquidity,
  ])

  return {
    lpApr,
    cakeApr,
    merklApr: Number(merklApr ?? 0) ?? 0,
  }
}
