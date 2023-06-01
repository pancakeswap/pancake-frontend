import { ChainId, Currency, Token, WNATIVE } from '@pancakeswap/sdk'
import { Address } from 'viem'

import { PoolSelectorConfig, V2PoolWithTvl, V3PoolWithTvl, WithTvl } from '../../types'
import { BASES_TO_CHECK_TRADES_AGAINST } from '../../../constants'
import { getV2PoolSelectorConfig, getV3PoolSelectorConfig } from '../../utils/getPoolSelectorConfig'
import { getPoolAddress as getPoolAddressUtil } from '../../utils'

const sortByTvl = (a: WithTvl, b: WithTvl) => (a.tvlUSD >= b.tvlUSD ? -1 : 1)

interface FactoryParams<P extends WithTvl> {
  getPoolSelectorConfig: (currencyA?: Currency, currencyB?: Currency) => PoolSelectorConfig
  getPoolAddress: (pool: P) => Address
  getToken0: (pool: P) => Currency
  getToken1: (pool: P) => Currency
}

function poolSelectorFactory<P extends WithTvl>({
  getPoolSelectorConfig,
  getToken0,
  getToken1,
  getPoolAddress,
}: FactoryParams<P>) {
  return function tvlSelector(
    currencyA: Currency | undefined,
    currencyB: Currency | undefined,
    unorderedPoolsWithTvl: P[],
  ) {
    const POOL_SELECTION_CONFIG = getPoolSelectorConfig(currencyA, currencyB)
    if (!currencyA || !currencyB || !unorderedPoolsWithTvl.length) {
      return []
    }
    const poolsFromSubgraph = unorderedPoolsWithTvl.sort(sortByTvl)
    const { chainId } = getToken0(poolsFromSubgraph[0])
    const baseTokens: Token[] = BASES_TO_CHECK_TRADES_AGAINST[chainId as ChainId] ?? []

    const poolSet = new Set<string>()
    const addToPoolSet = (pools: P[]) => {
      for (const pool of pools) {
        poolSet.add(getPoolAddress(pool))
      }
    }

    const topByBaseWithTokenIn = baseTokens
      .map((token) => {
        return poolsFromSubgraph
          .filter((subgraphPool) => {
            return (
              (getToken0(subgraphPool).wrapped.equals(token) &&
                getToken1(subgraphPool).wrapped.equals(currencyA.wrapped)) ||
              (getToken1(subgraphPool).wrapped.equals(token) &&
                getToken0(subgraphPool).wrapped.equals(currencyA.wrapped))
            )
          })
          .sort(sortByTvl)
          .slice(0, POOL_SELECTION_CONFIG.topNWithEachBaseToken)
      })
      .reduce<P[]>((acc, cur) => [...acc, ...cur], [])
      .sort(sortByTvl)
      .slice(0, POOL_SELECTION_CONFIG.topNWithBaseToken)

    addToPoolSet(topByBaseWithTokenIn)

    const topByBaseWithTokenOut = baseTokens
      .map((token) => {
        return poolsFromSubgraph
          .filter((subgraphPool) => {
            if (poolSet.has(getPoolAddress(subgraphPool))) {
              return false
            }
            return (
              (getToken0(subgraphPool).wrapped.equals(token) &&
                getToken1(subgraphPool).wrapped.equals(currencyB.wrapped)) ||
              (getToken1(subgraphPool).wrapped.equals(token) &&
                getToken0(subgraphPool).wrapped.equals(currencyB.wrapped))
            )
          })
          .sort(sortByTvl)
          .slice(0, POOL_SELECTION_CONFIG.topNWithEachBaseToken)
      })
      .reduce<P[]>((acc, cur) => [...acc, ...cur], [])
      .sort(sortByTvl)
      .slice(0, POOL_SELECTION_CONFIG.topNWithBaseToken)

    addToPoolSet(topByBaseWithTokenOut)

    const top2DirectPools = poolsFromSubgraph
      .filter((subgraphPool) => {
        if (poolSet.has(getPoolAddress(subgraphPool))) {
          return false
        }
        return (
          (getToken0(subgraphPool).wrapped.equals(currencyA.wrapped) &&
            getToken1(subgraphPool).wrapped.equals(currencyB.wrapped)) ||
          (getToken1(subgraphPool).wrapped.equals(currencyA.wrapped) &&
            getToken0(subgraphPool).wrapped.equals(currencyB.wrapped))
        )
      })
      .slice(0, POOL_SELECTION_CONFIG.topNDirectSwaps)

    addToPoolSet(top2DirectPools)

    const nativeToken = WNATIVE[chainId as ChainId]
    const top2EthBaseTokenPool = nativeToken
      ? poolsFromSubgraph
          .filter((subgraphPool) => {
            if (poolSet.has(getPoolAddress(subgraphPool))) {
              return false
            }
            return (
              (getToken0(subgraphPool).wrapped.equals(nativeToken) &&
                getToken1(subgraphPool).wrapped.equals(currencyA.wrapped)) ||
              (getToken1(subgraphPool).wrapped.equals(nativeToken) &&
                getToken0(subgraphPool).wrapped.equals(currencyA.wrapped))
            )
          })
          .slice(0, 1)
      : []
    addToPoolSet(top2EthBaseTokenPool)

    const top2EthQuoteTokenPool = nativeToken
      ? poolsFromSubgraph
          .filter((subgraphPool) => {
            if (poolSet.has(getPoolAddress(subgraphPool))) {
              return false
            }
            return (
              (getToken0(subgraphPool).wrapped.equals(nativeToken) &&
                getToken1(subgraphPool).wrapped.equals(currencyB.wrapped)) ||
              (getToken1(subgraphPool).wrapped.equals(nativeToken) &&
                getToken0(subgraphPool).wrapped.equals(currencyB.wrapped))
            )
          })
          .slice(0, 1)
      : []
    addToPoolSet(top2EthQuoteTokenPool)

    const topByTVL = poolsFromSubgraph
      .slice(0, POOL_SELECTION_CONFIG.topN)
      .filter((pool) => !poolSet.has(getPoolAddress(pool)))
    addToPoolSet(topByTVL)

    const topByTVLUsingTokenBase = poolsFromSubgraph
      .filter((subgraphPool) => {
        if (poolSet.has(getPoolAddress(subgraphPool))) {
          return false
        }
        return (
          getToken0(subgraphPool).wrapped.equals(currencyA.wrapped) ||
          getToken1(subgraphPool).wrapped.equals(currencyA.wrapped)
        )
      })
      .slice(0, POOL_SELECTION_CONFIG.topNTokenInOut)
    addToPoolSet(topByTVLUsingTokenBase)

    const topByTVLUsingTokenQuote = poolsFromSubgraph
      .filter((subgraphPool) => {
        if (poolSet.has(getPoolAddress(subgraphPool))) {
          return false
        }
        return (
          getToken0(subgraphPool).wrapped.equals(currencyB.wrapped) ||
          getToken1(subgraphPool).wrapped.equals(currencyB.wrapped)
        )
      })
      .slice(0, POOL_SELECTION_CONFIG.topNTokenInOut)
    addToPoolSet(topByTVLUsingTokenQuote)

    const getTopByTVLUsingTokenSecondHops = (base: P[], tokenToCompare: Currency) =>
      base
        .map((subgraphPool) => {
          return getToken0(subgraphPool).wrapped.equals(tokenToCompare.wrapped)
            ? getToken1(subgraphPool)
            : getToken0(subgraphPool)
        })
        .map((secondHopToken: Currency) => {
          return poolsFromSubgraph
            .filter((subgraphPool) => {
              if (poolSet.has(getPoolAddress(subgraphPool))) {
                return false
              }
              return (
                getToken0(subgraphPool).wrapped.equals(secondHopToken.wrapped) ||
                getToken1(subgraphPool).wrapped.equals(secondHopToken.wrapped)
              )
            })
            .slice(0, POOL_SELECTION_CONFIG.topNSecondHop)
        })
        .reduce<P[]>((acc, cur) => [...acc, ...cur], [])
        .sort(sortByTvl)
        .slice(0, POOL_SELECTION_CONFIG.topNSecondHop)

    const topByTVLUsingTokenInSecondHops = getTopByTVLUsingTokenSecondHops(
      [...topByTVLUsingTokenBase, ...topByBaseWithTokenIn],
      currencyA,
    )
    addToPoolSet(topByTVLUsingTokenInSecondHops)

    const topByTVLUsingTokenOutSecondHops = getTopByTVLUsingTokenSecondHops(
      [...topByTVLUsingTokenQuote, ...topByBaseWithTokenOut],
      currencyB,
    )
    addToPoolSet(topByTVLUsingTokenOutSecondHops)

    const pools = [
      ...topByBaseWithTokenIn,
      ...topByBaseWithTokenOut,
      ...top2DirectPools,
      ...top2EthBaseTokenPool,
      ...top2EthQuoteTokenPool,
      ...topByTVL,
      ...topByTVLUsingTokenBase,
      ...topByTVLUsingTokenQuote,
      ...topByTVLUsingTokenInSecondHops,
      ...topByTVLUsingTokenOutSecondHops,
    ]
    // eslint-disable-next-line
    return pools.map(({ tvlUSD, ...rest }) => rest)
  }
}

export const v3PoolTvlSelector = poolSelectorFactory<V3PoolWithTvl>({
  getPoolSelectorConfig: getV3PoolSelectorConfig,
  getToken0: (p) => p.token0,
  getToken1: (p) => p.token1,
  getPoolAddress: (p) => p.address,
})

export const v2PoolTvlSelector = poolSelectorFactory<V2PoolWithTvl>({
  getPoolSelectorConfig: getV2PoolSelectorConfig,
  getToken0: (p) => p.reserve0.currency,
  getToken1: (p) => p.reserve1.currency,
  getPoolAddress: (p) => getPoolAddressUtil(p) || '0x',
})
