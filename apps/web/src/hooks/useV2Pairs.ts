import { Pair } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import { PairState, useV2Pairs } from './usePairs'

export default function useV2PairsByAccount(account: string) {
  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()

  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = useV2Pairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))

  return useMemo(() => {
    const v2IsLoading =
      fetchingV2PairBalances ||
      v2Pairs?.length < liquidityTokensWithBalances.length ||
      (v2Pairs?.length && v2Pairs.every(([pairState]) => pairState === PairState.LOADING))
    const allV2PairsWithLiquidity: Pair[] = v2Pairs
      ?.filter(([pairState, pair]) => pairState === PairState.EXISTS && Boolean(pair))
      .map(([, pair]) => pair)

    return {
      data: allV2PairsWithLiquidity,
      loading: v2IsLoading,
    }
  }, [fetchingV2PairBalances, liquidityTokensWithBalances.length, v2Pairs])
}
