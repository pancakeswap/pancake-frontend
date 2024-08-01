import { ERC20Token } from '@pancakeswap/sdk'
import { LegacyRouter } from '@pancakeswap/smart-router/legacy-router'
import { unwrappedToken } from '@pancakeswap/tokens'
import { Position } from '@pancakeswap/v3-sdk'
import { useQueries, useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { useAllTokensByChainIds, useOfficialsAndUserAddedTokens } from 'hooks/Tokens'
import useIsTickAtLimit from 'hooks/v3/useIsTickAtLimit'
import { usePoolWithChainId } from 'hooks/v3/usePools'
import getPriceOrderingFromPositionForUI from 'hooks/v3/utils/getPriceOrderingFromPositionForUI'
import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import { safeGetAddress } from 'utils'
import { isAddressEqual } from 'viem'
import { Address } from 'viem/accounts'
import { PoolInfo } from '../type'
import { getAccountV2LpDetails, getAccountV3Positions, getStablePairDetails, getTrackedV2LpTokens } from './fetcher'
import type { PositionDetail, StableLPDetail, V2LPDetail } from './type'

export const useAccountV2LpDetails = (chainIds: number[], account?: Address | null) => {
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
        queryFn: () => getAccountV2LpDetails(Number(chainId), account!, lpTokens),
        enabled: !!account && lpTokens && lpTokens.length > 0,
        select(data) {
          return data.filter((d) => d.balance.greaterThan('0'))
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: false,
      } satisfies UseQueryOptions<V2LPDetail[]>
    })
  }, [account, lpTokensByChain])

  const combine = useCallback((results: UseQueryResult<V2LPDetail[], Error>[]) => {
    return {
      data: results.reduce((acc, result) => acc.concat(result.data ?? []), [] as V2LPDetail[]),
      pending: results.some((result) => result.isPending),
    }
  }, [])

  return useQueries({
    queries,
    combine,
  })
}

export const useAccountStableLpDetails = (chainIds: number[], account?: Address | null) => {
  const queries = useMemo(() => {
    return chainIds.map((chainId) => {
      const stablePairs = LegacyRouter.stableSwapPairsByChainId[chainId]
      return {
        queryKey: ['accountStableLpBalance', account, chainId],
        // @todo @ChefJerry add signal
        queryFn: () => getStablePairDetails(chainId, account!, stablePairs),
        enabled: !!account && stablePairs && stablePairs.length > 0,
        select(data) {
          return data.filter((d) => d.balance.greaterThan('0'))
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: SLOW_INTERVAL,
      } satisfies UseQueryOptions<StableLPDetail[]>
    })
  }, [account, chainIds])

  const combine = useCallback((results: UseQueryResult<StableLPDetail[], Error>[]) => {
    return {
      data: results.reduce((acc, result) => acc.concat(result.data ?? []), [] as StableLPDetail[]),
      pending: results.some((result) => result.isPending),
    }
  }, [])
  return useQueries({
    queries,
    combine,
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

  const combine = useCallback((results: UseQueryResult<PositionDetail[], Error>[]) => {
    return {
      data: results.reduce((acc, result) => acc.concat(result.data ?? []), [] as PositionDetail[]),
      pending: results.some((result) => result.isPending),
    }
  }, [])
  return useQueries({
    queries,
    combine,
  })
}

export const useTokenByChainId = (tokenAddress?: Address, chainId?: number) => {
  const tokens = useAllTokensByChainIds(chainId ? [chainId] : [])
  return useMemo(() => {
    return chainId && tokenAddress ? tokens[chainId][safeGetAddress(tokenAddress)!] : undefined
  }, [chainId, tokenAddress, tokens])
}

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

export const useAccountPositionDetailByPool = (chainId: number, account?: Address | null, poolInfo?: PoolInfo) => {
  const [currency0, currency1] = useMemo(() => {
    if (!poolInfo) return [undefined, undefined]
    const { token0, token1 } = poolInfo
    return [token0.wrapped, token1.wrapped]
  }, [poolInfo])
  const protocol = useMemo(() => poolInfo?.protocol, [poolInfo])
  const queryFn = useCallback(() => {
    if (protocol === 'v2') {
      return getAccountV2LpDetails(
        chainId,
        account!,
        currency0 && currency1 ? [[currency0.wrapped, currency1.wrapped]] : [],
      )
    }
    if (protocol === 'stable') {
      const stablePair = LegacyRouter.stableSwapPairsByChainId[chainId].find((pair) => {
        return isAddressEqual(pair.stableSwapAddress, poolInfo?.lpAddress as Address)
      })
      return getStablePairDetails(chainId, account!, stablePair ? [stablePair] : [])
    }
    if (protocol === 'v3') {
      return getAccountV3Positions(chainId, account!)
    }
    return Promise.resolve([])
  }, [account, chainId, currency0, currency1, poolInfo?.lpAddress, protocol])
  const select = useCallback(
    (data) => {
      if (protocol === 'v3') {
        // v3
        const d = data.filter((position) => {
          const { token0, token1, fee } = position as PositionDetail
          return (
            poolInfo?.token0.wrapped.address &&
            isAddressEqual(token0, poolInfo?.token0.wrapped.address as Address) &&
            poolInfo?.token1.address &&
            isAddressEqual(token1, poolInfo?.token1.wrapped.address as Address) &&
            fee === poolInfo?.feeTier
          )
        })
        return d as PositionDetail[]
      }

      return data?.[0] && data[0].balance.greaterThan('0') ? data[0] : undefined
    },
    [poolInfo, protocol],
  )
  return useQuery({
    queryKey: ['accountPosition', account, chainId, poolInfo?.lpAddress],
    queryFn,
    enabled: !!account && !!poolInfo?.lpAddress,
    select,
  })
}
