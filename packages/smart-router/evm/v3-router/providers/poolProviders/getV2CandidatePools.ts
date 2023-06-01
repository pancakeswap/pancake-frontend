import { BigintIsh, Currency, CurrencyAmount, Price, ZERO } from '@pancakeswap/sdk'
import { formatPrice } from '@pancakeswap/utils/formatFractions'

import { OnChainProvider, SubgraphProvider, V2PoolWithTvl } from '../../types'
import { withFallback } from '../../../utils/withFallback'
import { getV2PoolSubgraph } from './subgraphPoolProviders'
import { getV2PoolsOnChain } from './onChainPoolProviders'
import { getCommonTokenPrices } from '../getCommonTokenPrices'
import { getPairCombinations } from '../../functions'
import { getPoolAddress } from '../../utils'
import { v2PoolTvlSelector } from './poolTvlSelectors'

interface Params {
  currencyA?: Currency
  currencyB?: Currency
  onChainProvider?: OnChainProvider
  v2SubgraphProvider?: SubgraphProvider
  v3SubgraphProvider?: SubgraphProvider
  blockNumber?: BigintIsh

  // Only use this param if we want to specify pairs we want to get
  pairs?: [Currency, Currency][]
}

export async function getV2PoolsWithTvlByCommonTokenPrices({
  currencyA,
  currencyB,
  pairs: providedPairs,
  onChainProvider,
  v3SubgraphProvider,
  blockNumber,
}: Omit<Params, 'v2SubgraphProvider'>) {
  const pairs = providedPairs || getPairCombinations(currencyA, currencyB)
  const [poolsFromOnChain, baseTokenUsdPrices] = await Promise.all([
    getV2PoolsOnChain(pairs, onChainProvider, blockNumber),
    getCommonTokenPrices({ currencyA, currencyB, v3SubgraphProvider }),
  ])

  if (!poolsFromOnChain) {
    throw new Error('Failed to get v2 candidate pools')
  }

  if (!baseTokenUsdPrices) {
    console.debug('Failed to get base token prices')
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

export async function getV2CandidatePools(params: Params) {
  const { v2SubgraphProvider, currencyA, currencyB, pairs: providedPairs } = params
  const pairs = providedPairs || getPairCombinations(currencyA, currencyB)

  const getPools = withFallback([
    {
      asyncFn: () => getV2PoolsWithTvlByCommonTokenPrices(params),
      timeout: 3000,
    },
    {
      asyncFn: () => getV2PoolSubgraph({ provider: v2SubgraphProvider, pairs }),
    },
  ])

  const pools = await getPools()
  return v2PoolTvlSelector(currencyA, currencyB, pools)
}
