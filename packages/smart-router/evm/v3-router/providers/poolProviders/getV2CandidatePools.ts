import { BigintIsh, Currency, CurrencyAmount, Price, ZERO } from '@pancakeswap/sdk'
import { formatPrice } from '@pancakeswap/utils/formatFractions'

import { WithFallbackOptions, createAsyncCallWithFallbacks } from '../../../utils/withFallback'
import { getPairCombinations } from '../../functions'
import { OnChainProvider, SubgraphProvider, V2PoolWithTvl } from '../../types'
import { getPoolAddress, logger } from '../../utils'
import { CommonTokenPriceProvider, getCommonTokenPrices as defaultGetCommonTokenPrices } from '../getCommonTokenPrices'
import { getV2PoolsOnChain } from './onChainPoolProviders'
import { v2PoolTvlSelector } from './poolTvlSelectors'
import { getV2PoolSubgraph } from './subgraphPoolProviders'

export type GetV2PoolsParams = {
  currencyA?: Currency
  currencyB?: Currency
  onChainProvider?: OnChainProvider
  blockNumber?: BigintIsh

  // Only use this param if we want to specify pairs we want to get
  pairs?: [Currency, Currency][]
}

type SubgraphProviders = {
  v2SubgraphProvider?: SubgraphProvider
  v3SubgraphProvider?: SubgraphProvider
}

type Params = GetV2PoolsParams & SubgraphProviders

export function createV2PoolsProviderByCommonTokenPrices<T = any>(getCommonTokenPrices: CommonTokenPriceProvider<T>) {
  return async function getV2Pools({
    currencyA,
    currencyB,
    pairs: providedPairs,
    onChainProvider,
    blockNumber,
    ...rest
  }: GetV2PoolsParams & T) {
    const pairs = providedPairs || (await getPairCombinations(currencyA, currencyB))
    const [poolsFromOnChain, baseTokenUsdPrices] = await Promise.all([
      getV2PoolsOnChain(pairs, onChainProvider, blockNumber),
      getCommonTokenPrices({ currencyA, currencyB, ...(rest as T) }),
    ])

    if (!poolsFromOnChain) {
      throw new Error('Failed to get v2 candidate pools')
    }

    if (!baseTokenUsdPrices) {
      logger.log('Failed to get base token prices')
      return poolsFromOnChain.map((pool) => {
        return {
          ...pool,
          tvlUSD: BigInt(0),
          address: getPoolAddress(pool),
        }
      })
    }

    return poolsFromOnChain.map<V2PoolWithTvl>((pool) => {
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
        address: getPoolAddress(pool),
      }
    })
  }
}

export const getV2PoolsWithTvlByCommonTokenPrices = createV2PoolsProviderByCommonTokenPrices<{
  v3SubgraphProvider?: SubgraphProvider
}>(defaultGetCommonTokenPrices)

type GetV2Pools<T = any> = (params: GetV2PoolsParams & T) => Promise<V2PoolWithTvl[]>

export function createGetV2CandidatePools<T = any>(
  defaultGetV2Pools: GetV2Pools<T>,
  options?: WithFallbackOptions<GetV2Pools<T>>,
) {
  const getV2PoolsWithFallbacks = createAsyncCallWithFallbacks(defaultGetV2Pools, options)

  return async function getV2Pools(params: GetV2PoolsParams & T) {
    const { currencyA, currencyB } = params
    const pools = await getV2PoolsWithFallbacks(params)
    return v2PoolTvlSelector(currencyA, currencyB, pools)
  }
}

export async function getV2CandidatePools(params: Params) {
  const fallbacks: GetV2Pools[] = [
    async ({ pairs: providedPairs, currencyA, currencyB, v2SubgraphProvider }) => {
      const pairs = providedPairs || (await getPairCombinations(currencyA, currencyB))
      return getV2PoolSubgraph({ provider: v2SubgraphProvider, pairs })
    },
  ]
  const getV2PoolsWithFallbacks = createGetV2CandidatePools<SubgraphProviders>(getV2PoolsWithTvlByCommonTokenPrices, {
    fallbacks,
    fallbackTimeout: 3000,
  })
  return getV2PoolsWithFallbacks(params)
}
