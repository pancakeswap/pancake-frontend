import { unwrappedToken } from '@pancakeswap/tokens'
import { Position } from '@pancakeswap/v3-sdk'
import { useTokenByChainId } from 'hooks/Tokens'
import useIsTickAtLimit from 'hooks/v3/useIsTickAtLimit'
import { usePoolByChainId } from 'hooks/v3/usePools'
import getPriceOrderingFromPositionForUI from 'hooks/v3/utils/getPriceOrderingFromPositionForUI'
import { useMemo } from 'react'
import { PositionDetail } from '../type'

// @todo @ChefJerry consider merge to useAccountV3Positions
export const useExtraV3PositionInfo = (positionDetail?: PositionDetail) => {
  const chainId = positionDetail?.chainId
  const token0 = useTokenByChainId(positionDetail?.token0, chainId)
  const token1 = useTokenByChainId(positionDetail?.token1, chainId)
  const currency0 = token0 ? unwrappedToken(token0) : undefined
  const currency1 = token1 ? unwrappedToken(token1) : undefined

  const [, pool] = usePoolByChainId(currency0 ?? undefined, currency1 ?? undefined, positionDetail?.fee as number)

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

  const price = useMemo(() => {
    return pool && token0 ? pool.priceOf(token0) : undefined
  }, [pool, token0])

  const { priceLower, priceUpper, quote, base } = useMemo(() => {
    // return {
    //   priceLower: position ? position.token0PriceLower : undefined,
    //   priceUpper: position ? position.token0PriceUpper : undefined,
    //   quote: token1,
    //   base: token0,
    // }
    return getPriceOrderingFromPositionForUI(position)
  }, [position])

  return {
    pool,
    position,
    tickAtLimit,
    outOfRange,
    removed,
    price,
    priceLower,
    priceUpper,
    currency0,
    currency1,
    quote,
    base,
  }
}
