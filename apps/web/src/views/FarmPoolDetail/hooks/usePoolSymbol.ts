import { useMemo } from 'react'
import { PoolType, usePoolDataQueryV2 } from 'state/info/hooks'
import { getTokenSymbolAlias } from 'utils/getTokenAlias'
import { useRouterQuery } from './useRouterQuery'

export const usePoolSymbol = () => {
  const { version, pools, chainId } = useRouterQuery()
  const { data: poolData } = usePoolDataQueryV2(pools as string, version as PoolType, chainId)
  const [poolSymbol, symbol0, symbol1] = useMemo(() => {
    const s0 = getTokenSymbolAlias(poolData?.token0.address, chainId, poolData?.token0.symbol) ?? ''
    const s1 = getTokenSymbolAlias(poolData?.token1.address, chainId, poolData?.token1.symbol) ?? ''
    return [`${s0} / ${s1}`, s0, s1]
  }, [chainId, poolData?.token0.address, poolData?.token0.symbol, poolData?.token1.address, poolData?.token1.symbol])

  return {
    poolSymbol,
    symbol0,
    symbol1,
  }
}
