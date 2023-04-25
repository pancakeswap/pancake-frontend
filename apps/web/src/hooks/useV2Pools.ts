import { CurrencyAmount, Pair as SDKPair, Currency, Token, Price, ZERO } from '@pancakeswap/sdk'
import { SmartRouter, V2Pool, BASES_TO_CHECK_TRADES_AGAINST } from '@pancakeswap/smart-router/evm'
import { formatPrice } from '@pancakeswap/utils/formatFractions'
import { useEffect, useMemo, useRef } from 'react'
import useSWR from 'swr'
import { gql } from 'graphql-request'

import { infoClientWithChain, v3Clients } from 'utils/graphql'

import { useV2CandidatePools as useV2PoolsFromOnChain } from './usePoolsOnChain'

type Pair = [Currency, Currency]

export interface V2PoolsHookParams {
  // Used for caching
  key?: string
  blockNumber?: number
  enabled?: boolean
}

export interface V2PoolsResult {
  pools: V2Pool[] | null
  loading: boolean
  syncing: boolean
  blockNumber?: number
}

export function useV2CandidatePools(currencyA?: Currency, currencyB?: Currency, options?: V2PoolsHookParams) {
  const key = useMemo(() => {
    if (!currencyA || !currencyB || currencyA.wrapped.equals(currencyB.wrapped)) {
      return ''
    }
    const symbols = currencyA.wrapped.sortsBefore(currencyB.wrapped)
      ? [currencyA.symbol, currencyB.symbol]
      : [currencyB.symbol, currencyA.symbol]
    return [...symbols, currencyA.chainId].join('_')
  }, [currencyA, currencyB])

  const pairs = useMemo(() => {
    SmartRouter.metric('Getting pairs from', currencyA?.symbol, currencyB?.symbol)
    return currencyA && currencyB && SmartRouter.getPairCombinations(currencyA, currencyB)
  }, [currencyA, currencyB])
  const { data: poolsFromSubgraphState, isLoading, isValidating } = useV2PoolsFromSubgraph(pairs, { ...options, key })

  const candidatePools = useMemo<V2Pool[] | null>(() => {
    if (!poolsFromSubgraphState?.pools || !currencyA || !currencyB) {
      return null
    }
    return SmartRouter.v2PoolSubgraphSelection(currencyA, currencyB, poolsFromSubgraphState.pools)
  }, [poolsFromSubgraphState, currencyA, currencyB])

  return {
    pools: candidatePools,
    loading: isLoading,
    syncing: isValidating,
    blockNumber: poolsFromSubgraphState?.blockNumber,
    key: poolsFromSubgraphState?.key,
  }
}

const tokenPriceQuery = gql`
  query getTokens($pageSize: Int!, $tokenAddrs: [ID!]) {
    tokens(first: $pageSize, where: { id_in: $tokenAddrs }) {
      id
      derivedUSD
    }
  }
`

export function useV2CandidatePoolsFromOnChain(
  currencyA?: Currency,
  currencyB?: Currency,
  params: V2PoolsHookParams = {},
) {
  const { data: baseTokenUsdPrices, isLoading: usdPriceLoading } = useSWR<Map<string, number>>(
    currencyA && ['BasesUsdPrice', currencyA?.chainId],
    async () => {
      const baseTokens: Token[] = BASES_TO_CHECK_TRADES_AGAINST[currencyA?.chainId]
      const client = v3Clients[currencyA?.chainId]
      if (!client || !baseTokens) {
        return null
      }
      const map = new Map<string, number>()
      const idToToken: { [key: string]: Currency } = {}
      const addresses = baseTokens.map((t) => {
        const address = t.address.toLocaleLowerCase()
        idToToken[address] = t
        return address
      })
      try {
        const { tokens: tokenPrices } = await client.request<{ tokens: { id: string; derivedUSD: string }[] }>(
          tokenPriceQuery,
          {
            pageSize: 1000,
            tokenAddrs: addresses,
          },
        )
        for (const { id, derivedUSD } of tokenPrices) {
          const token = idToToken[id]
          if (token) {
            map.set(token.wrapped.address, parseFloat(derivedUSD) || 0)
          }
        }
      } catch (e) {
        console.error(e)
      }
      return map
    },
    {
      revalidateOnFocus: false,
    },
  )

  const poolStateFromOnChain = useV2PoolsFromOnChain(currencyA, currencyB, params)
  const { pools: poolsFromOnChain, loading: poolsLoading } = poolStateFromOnChain

  const poolsWithTvl = useMemo<SmartRouter.SubgraphV2Pool[] | null>(
    () =>
      baseTokenUsdPrices && poolsFromOnChain
        ? poolsFromOnChain.map((pool: V2Pool) => {
            const getAmountUsd = (amount: CurrencyAmount<Currency>) => {
              if (amount.equalTo(ZERO)) {
                return 0
              }
              const price = baseTokenUsdPrices.get(amount.currency.wrapped.address)
              if (price !== undefined) {
                return parseFloat(amount.toExact()) * price
              }
              const againstAmount = pool.reserve0.currency.equals(amount.currency) ? pool.reserve1 : pool.reserve0
              const againstUsdPrice = baseTokenUsdPrices.get(againstAmount.currency.wrapped.address)
              if (againstUsdPrice) {
                const poolPrice = new Price({ baseAmount: amount, quoteAmount: againstAmount })
                return parseFloat(amount.toExact()) * parseFloat(formatPrice(poolPrice, 6) || '0')
              }
              return 0
            }
            return {
              ...pool,
              tvlUSD: BigInt(Math.floor(getAmountUsd(pool.reserve0) + getAmountUsd(pool.reserve1))),
              address: SDKPair.getAddress(pool.reserve0.wrapped.currency, pool.reserve1.wrapped.currency),
            }
          })
        : null,
    [poolsFromOnChain, baseTokenUsdPrices],
  )
  const candidatePools = useMemo<V2Pool[] | null>(() => {
    if (!poolsWithTvl || !currencyA || !currencyB) {
      return null
    }
    return SmartRouter.v2PoolSubgraphSelection(currencyA, currencyB, poolsWithTvl)
  }, [poolsWithTvl, currencyA, currencyB])

  return {
    ...poolStateFromOnChain,
    pools: candidatePools,
    isLoading: poolsLoading || usdPriceLoading,
  }
}

export function useV2PoolsFromSubgraph(pairs?: Pair[], { key, blockNumber, enabled = true }: V2PoolsHookParams = {}) {
  const fetchingBlock = useRef<string | null>(null)
  const queryEnabled = Boolean(enabled && key && pairs?.length)
  const result = useSWR<{
    pools: SmartRouter.SubgraphV2Pool[]
    key?: string
    blockNumber?: number
  }>(
    queryEnabled && ['V2PoolsFromSubgraph', key],
    async () => {
      fetchingBlock.current = blockNumber.toString()
      try {
        const pools = await SmartRouter.getV2PoolSubgraph({
          provider: ({ chainId }) => infoClientWithChain(chainId),
          pairs,
        })
        return {
          pools,
          key,
          blockNumber,
        }
      } finally {
        fetchingBlock.current = null
      }
    },
    {
      revalidateOnFocus: false,
    },
  )

  const { mutate, data } = result
  useEffect(() => {
    // Revalidate pools if block number increases
    if (
      queryEnabled &&
      blockNumber &&
      fetchingBlock.current !== blockNumber.toString() &&
      (!data?.blockNumber || blockNumber > data.blockNumber)
    ) {
      mutate()
    }
  }, [blockNumber, mutate, data?.blockNumber, queryEnabled])
  return result
}
