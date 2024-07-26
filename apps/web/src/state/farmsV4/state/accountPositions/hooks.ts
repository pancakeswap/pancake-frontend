import { CurrencyAmount, ERC20Token, Pair } from '@pancakeswap/sdk'
import { LegacyRouter } from '@pancakeswap/smart-router/legacy-router'
import { useQueries, UseQueryOptions } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { useOfficialsAndUserAddedTokens } from 'hooks/Tokens'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import { Address } from 'viem/accounts'
import { getAccountV2LpBalance, getTrackedV2LpTokens } from './fetcher'

/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
export function getV2LiquidityToken([tokenA, tokenB]: [ERC20Token, ERC20Token]): ERC20Token {
  return new ERC20Token(
    tokenA.chainId,
    Pair.getAddress(tokenA, tokenB),
    18,
    `${tokenA.symbol}-${tokenB.symbol} V2 LP`,
    'Pancake LPs',
  )
}

export const useAccountV2LpBalance = (chainIds: number[], account?: Address | null) => {
  const tokens = useOfficialsAndUserAddedTokens()
  const userSavedPairs = useSelector<AppState, AppState['user']['pairs']>(({ user: { pairs } }) => pairs)
  const lpTokensByChain = useMemo(() => {
    const result: Record<number, [ERC20Token, ERC20Token][]> = {}
    chainIds.forEach((chainId) => {
      const lpTokens = getTrackedV2LpTokens(chainId, tokens, userSavedPairs)
      if (lpTokens && lpTokens.length > 0) {
        result[chainId] = lpTokens
      }
    })
    return result
  }, [chainIds, tokens, userSavedPairs])
  const queries = useMemo(() => {
    return Object.entries(lpTokensByChain).map(([chainId, lpTokens]) => {
      return {
        queryKey: ['accountV2LpBalance', account, chainId],
        // @todo @ChefJerry add signal
        queryFn: () => getAccountV2LpBalance(Number(chainId), account!, lpTokens.map(getV2LiquidityToken)),
        enabled: !!account && lpTokens && lpTokens.length > 0,
        select(data) {
          return data.filter((d) => d.greaterThan('0'))
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: SLOW_INTERVAL,
      } satisfies UseQueryOptions<CurrencyAmount<ERC20Token>[]>
    })
  }, [account, lpTokensByChain])

  return useQueries({
    queries,
    combine: (results) => {
      return {
        data: results.reduce((acc, result) => acc.concat(result.data ?? []), [] as CurrencyAmount<ERC20Token>[]),
        pending: results.some((result) => result.isPending),
      }
    },
  })
}

export const useAccountStableLpBalance = (chainIds: number[], account?: Address | null) => {
  const queries = useMemo(() => {
    return chainIds.map((chainId) => {
      const stablePairs = LegacyRouter.stableSwapPairsByChainId[chainId]
      return {
        queryKey: ['accountStableLpBalance', account, chainId],
        // @todo @ChefJerry add signal
        queryFn: () =>
          getAccountV2LpBalance(
            chainId,
            account!,
            stablePairs.map(({ liquidityToken }) => liquidityToken),
          ),
        enabled: !!account && stablePairs && stablePairs.length > 0,
        select(data) {
          return data.filter((d) => d.greaterThan('0'))
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: SLOW_INTERVAL,
      } satisfies UseQueryOptions<CurrencyAmount<ERC20Token>[]>
    })
  }, [account, chainIds])

  return useQueries({
    queries,
    combine: (results) => {
      return {
        data: results.reduce((acc, result) => acc.concat(result.data ?? []), [] as CurrencyAmount<ERC20Token>[]),
        pending: results.some((result) => result.isPending),
      }
    },
  })
}
