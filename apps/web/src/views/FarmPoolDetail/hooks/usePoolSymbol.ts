import { useMemo } from 'react'
import { useChainIdByQuery } from 'state/info/hooks'
import { getTokenSymbolAlias } from 'utils/getTokenAlias'
import { usePoolData } from './usePoolData'

export const usePoolSymbol = () => {
  const poolData = usePoolData()
  const chainId = useChainIdByQuery()

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
