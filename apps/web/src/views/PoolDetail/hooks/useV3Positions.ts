import { unwrappedToken } from '@pancakeswap/tokens'
import { Position } from '@pancakeswap/v3-sdk'
import { useTokenByChainId } from 'hooks/Tokens'
import { usePoolByChainId } from 'hooks/v3/usePools'
import { useMemo } from 'react'
import { PositionDetail } from 'state/farmsV4/state/accountPositions/type'
import { Address } from 'viem'

export const useV3Positions = (
  chainId?: number,
  token0_?: Address,
  token1_?: Address,
  fee?: number,
  positionDetails?: PositionDetail[],
): Position[] => {
  const token0 = useTokenByChainId(token0_, chainId)
  const token1 = useTokenByChainId(token1_, chainId)
  const currency0 = token0 ? unwrappedToken(token0) : undefined
  const currency1 = token1 ? unwrappedToken(token1) : undefined

  const [, pool] = usePoolByChainId(currency0 ?? undefined, currency1 ?? undefined, fee)

  return useMemo(() => {
    if (pool && positionDetails && positionDetails.length > 0) {
      return positionDetails.map((positionDetail) => {
        return new Position({
          pool,
          liquidity: positionDetail.liquidity.toString(),
          tickLower: positionDetail.tickLower,
          tickUpper: positionDetail.tickUpper,
        })
      })
    }
    return []
  }, [pool, positionDetails])
}
