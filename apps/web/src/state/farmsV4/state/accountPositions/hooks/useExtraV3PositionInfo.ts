import { unwrappedToken } from '@pancakeswap/tokens'
import { Position } from '@pancakeswap/v3-sdk'
import useIsTickAtLimit from 'hooks/v3/useIsTickAtLimit'
import { usePoolWithChainId } from 'hooks/v3/usePools'
import getPriceOrderingFromPositionForUI from 'hooks/v3/utils/getPriceOrderingFromPositionForUI'
import { useMemo } from 'react'
import { PositionDetail } from '../type'
import { useTokenByChainId } from './useTokenByChainId'

// @todo @ChefJerry consider merge to useAccountV3Positions
export const useExtraV3PositionInfo = (positionDetail?: PositionDetail) => {
  const chainId = positionDetail?.chainId
  const token0 = useTokenByChainId(positionDetail?.token0, chainId)
  const token1 = useTokenByChainId(positionDetail?.token1, chainId)
  const currency0 = token0 ? unwrappedToken(token0) : undefined
  const currency1 = token1 ? unwrappedToken(token1) : undefined

  const [, pool] = usePoolWithChainId(
    currency0 ?? undefined,
    currency1 ?? undefined,
    positionDetail?.fee as number,
    chainId,
  )

  const position = useMemo(() => {
    if (pool && positionDetail) {
      return new Position({
        pool,
        liquidity: positionDetail.liquidity.toString(),
        tickLower: positionDetail.tickLower,
        tickUpper: positionDetail.tickUpper,
      })
    }
    return undefined
  }, [pool, positionDetail])

  const tickAtLimit = useIsTickAtLimit(
    positionDetail?.fee as number,
    positionDetail?.tickLower as number,
    positionDetail?.tickUpper as number,
  )

  const outOfRange = useMemo(() => {
    return pool && positionDetail
      ? pool.tickCurrent < positionDetail.tickLower || pool.tickCurrent >= positionDetail.tickUpper
      : false
  }, [pool, positionDetail])

  const removed = useMemo(() => {
    return positionDetail ? positionDetail.liquidity === 0n : false
  }, [positionDetail])

  const { priceLower, priceUpper } = useMemo(() => getPriceOrderingFromPositionForUI(position), [position])

  return {
    pool,
    position,
    tickAtLimit,
    outOfRange,
    removed,
    priceLower,
    priceUpper,
    currency0,
    currency1,
  }
}
