import { CurrencyAmount, ERC20Token, Pair } from '@pancakeswap/sdk'
import { LegacyRouter } from '@pancakeswap/smart-router/legacy-router'
import { unwrappedToken } from '@pancakeswap/tokens'
import { Position } from '@pancakeswap/v3-sdk'
import { useQueries, UseQueryOptions } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { useAllTokensByChainIds, useOfficialsAndUserAddedTokens } from 'hooks/Tokens'
import useIsTickAtLimit from 'hooks/v3/useIsTickAtLimit'
import { usePoolWithChainId } from 'hooks/v3/usePools'
import getPriceOrderingFromPositionForUI from 'hooks/v3/utils/getPriceOrderingFromPositionForUI'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import { safeGetAddress } from 'utils'
import { Address } from 'viem/accounts'
import { getAccountV2LpBalance, getAccountV3Positions, getTrackedV2LpTokens } from './fetcher'
import { PositionDetail } from './type'

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

export const useAccountV3Positions = (chainIds: number[], account?: Address | null) => {
  const queries = useMemo(() => {
    return chainIds.map((chainId) => {
      return {
        queryKey: ['accountV3Positions', account, chainId],
        // @todo @ChefJerry add signal
        queryFn: () => getAccountV3Positions(chainId, account!),
        enabled: !!account && !!chainId,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: SLOW_INTERVAL,
      } satisfies UseQueryOptions<PositionDetail[]>
    })
  }, [account, chainIds])

  return useQueries({
    queries,
    combine: (results) => {
      return {
        data: results.reduce((acc, result) => acc.concat(result.data ?? []), [] as PositionDetail[]),
        pending: results.some((result) => result.isPending),
      }
    },
  })
}

export const useTokenByChainId = (tokenAddress?: Address, chainId?: number) => {
  const tokens = useAllTokensByChainIds(chainId ? [chainId] : [])
  return useMemo(() => {
    return chainId && tokenAddress ? tokens[chainId][safeGetAddress(tokenAddress)!] : undefined
  }, [chainId, tokenAddress, tokens])
}
export const useExtraV3PositionInfo = (positionDetail?: PositionDetail) => {
  const chainId = positionDetail?.chainId
  const token0 = useTokenByChainId(positionDetail?.token0 as Address, chainId)
  const token1 = useTokenByChainId(positionDetail?.token1 as Address, chainId)
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

  const { priceLower, priceUpper, quote, base } = useMemo(() => getPriceOrderingFromPositionForUI(position), [position])

  const currencyQuote = useMemo(() => (quote ? unwrappedToken(quote) : undefined), [quote])
  const currencyBase = useMemo(() => (base ? unwrappedToken(base) : undefined), [base])

  return {
    pool,
    position,
    tickAtLimit,
    outOfRange,
    removed,
    priceLower,
    priceUpper,
    currencyQuote,
    currencyBase,
  }
}
