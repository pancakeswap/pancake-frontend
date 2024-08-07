import { useMemo } from 'react'
import { useChainIdByQuery } from 'state/info/hooks'
import { getTokenSymbolAlias } from 'utils/getTokenAlias'
import { usePoolInfoByQuery } from './usePoolInfo'

export const usePoolSymbol = () => {
  const poolInfo = usePoolInfoByQuery()
  const chainId = useChainIdByQuery()

  const [poolSymbol, symbol0, symbol1] = useMemo(() => {
    const s0 = getTokenSymbolAlias(poolInfo?.token0.wrapped.address, chainId, poolInfo?.token0.wrapped.symbol) ?? ''
    const s1 = getTokenSymbolAlias(poolInfo?.token1.wrapped.address, chainId, poolInfo?.token1.wrapped.symbol) ?? ''
    return [`${s0} / ${s1}`, s0, s1]
  }, [
    poolInfo?.token0.wrapped.address,
    poolInfo?.token0.wrapped.symbol,
    poolInfo?.token1.wrapped.address,
    poolInfo?.token1.wrapped.symbol,
    chainId,
  ])

  return {
    poolSymbol,
    symbol0,
    symbol1,
  }
}
