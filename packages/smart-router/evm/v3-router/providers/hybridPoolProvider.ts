import { Call, createMulticall } from '@pancakeswap/multicall'
import { ChainId, Currency, CurrencyAmount, Pair, JSBI, Percent } from '@pancakeswap/sdk'
import { deserializeToken } from '@pancakeswap/token-lists'

import { getPairCombinations } from '../functions'
import { OnChainProvider, Pool, PoolProvider, PoolType, V2Pool, StablePool } from '../types'
import { createPoolProviderWithCache } from './poolProviderWithCache'
import IPancakePairABI from '../../abis/IPancakePair.json'
import IStablePoolABI from '../../abis/StableSwapPair.json'
import { getStableSwapPools } from '../../constants/stableSwap'

export function createHybridPoolProvider(onChainProvider: OnChainProvider): PoolProvider {
  const hybridPoolProvider: PoolProvider = {
    getCandidatePools: async (currencyA, currencyB, blockNumber) => {
      const pairs = getPairCombinations(currencyA, currencyB)
      return hybridPoolProvider.getPools(pairs, blockNumber)
    },

    getPool: async () => {
      return null
    },

    getPools: async (pairs, blockNumber) => {
      // eslint-disable-next-line
      console.log(blockNumber)
      return getPools(pairs, { provider: onChainProvider })
    },
  }

  return createPoolProviderWithCache(hybridPoolProvider)
}

interface PoolMeta {
  currencyA: Currency
  currencyB: Currency
  address: string
}

interface Options {
  provider: OnChainProvider
}

async function getPools(pairs: [Currency, Currency][], { provider }: Options): Promise<Pool[]> {
  const chainId = pairs[0]?.[0]?.chainId
  if (!chainId) {
    return []
  }

  const [v2Pools, stablePools] = await Promise.all([getV2Pools(pairs, provider), getStablePools(pairs, provider)])
  return [...v2Pools, ...stablePools]
}

const getV2Pools = createPoolFactory<V2Pool>(
  IPancakePairABI,
  ([currencyA, currencyB]) => [
    { address: Pair.getAddress(currencyA.wrapped, currencyB.wrapped), currencyA, currencyB },
  ],
  (address) => [
    {
      address,
      name: 'getReserves',
      params: [],
    },
  ],
  ({ currencyA, currencyB }, [{ reserve0, reserve1 }]) => {
    if (!reserve0 || !reserve1) {
      return null
    }
    const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped)
      ? [currencyA, currencyB]
      : [currencyB, currencyA]
    return {
      type: PoolType.V2,
      reserve0: CurrencyAmount.fromRawAmount(token0, reserve0),
      reserve1: CurrencyAmount.fromRawAmount(token1, reserve1),
    }
  },
)

const getStablePools = createPoolFactory<StablePool>(
  IStablePoolABI,
  ([currencyA, currencyB]) => {
    const poolConfigs = getStableSwapPools(currencyA.chainId)
    return poolConfigs
      .filter(({ token, quoteToken }) => {
        const tokenA = deserializeToken(token)
        const tokenB = deserializeToken(quoteToken)
        return (
          (tokenA.equals(currencyA.wrapped) && tokenB.equals(currencyB.wrapped)) ||
          (tokenA.equals(currencyB.wrapped) && tokenB.equals(currencyA.wrapped))
        )
      })
      .map(({ stableSwapAddress }) => ({
        address: stableSwapAddress,
        currencyA,
        currencyB,
      }))
  },
  (address) => [
    {
      address,
      name: 'balances',
      params: [0],
    },
    {
      address,
      name: 'balances',
      params: [1],
    },
    {
      address,
      name: 'A',
      params: [],
    },
    {
      address,
      name: 'fee',
      params: [],
    },
    {
      address,
      name: 'FEE_DENOMINATOR',
      params: [],
    },
  ],
  ({ currencyA, currencyB }, [balance0, balance1, a, fee, feeDenominator]) => {
    if (!balance0 || !balance1 || !a || !fee || !feeDenominator) {
      return null
    }
    const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped)
      ? [currencyA, currencyB]
      : [currencyB, currencyA]
    return {
      type: PoolType.STABLE,
      balances: [CurrencyAmount.fromRawAmount(token0, balance0), CurrencyAmount.fromRawAmount(token1, balance1)],
      amplifier: JSBI.BigInt(a),
      fee: new Percent(JSBI.BigInt(fee), JSBI.BigInt(feeDenominator)),
    }
  },
)

function createPoolFactory<TPool extends Pool>(
  abi: any[],
  getPossiblePoolMetas: (pair: [Currency, Currency]) => PoolMeta[],
  buildPoolInfoCalls: (poolAddress: string) => Call[],
  buildPool: (poolMeta: PoolMeta, data: any[]) => TPool | null,
) {
  return async function poolFactory(pairs: [Currency, Currency][], provider: OnChainProvider): Promise<TPool[]> {
    const chainId: ChainId = pairs[0]?.[0]?.chainId
    if (!chainId) {
      return []
    }

    const { multicallv2 } = createMulticall(provider)
    const poolAddressSet = new Set<string>()

    const poolMetas: PoolMeta[] = []
    for (const pair of pairs) {
      const possiblePoolMetas = getPossiblePoolMetas(pair)
      for (const meta of possiblePoolMetas) {
        if (!poolAddressSet.has(meta.address)) {
          poolMetas.push(meta)
          poolAddressSet.add(meta.address)
        }
      }
    }

    let calls: Call[] = []
    let poolCallSize = 0
    for (const { address } of poolMetas) {
      const poolCalls: Call[] = buildPoolInfoCalls(address)
      if (!poolCallSize) {
        poolCallSize = poolCalls.length
      }
      if (!poolCallSize || poolCallSize !== poolCalls.length) {
        throw new Error('Inconsistent pool data call')
      }
      calls = [...calls, ...poolCalls]
    }

    const results = await multicallv2({
      abi,
      calls,
      chainId,
      options: {
        requireSuccess: false,
      },
    })

    const pools: TPool[] = []
    for (let i = 0; i < poolMetas.length; i += 1) {
      const poolResults = results.slice(i * poolCallSize, (i + 1) * poolCallSize)
      const pool = buildPool(poolMetas[i], poolResults)
      if (pool) {
        pools.push(pool)
      }
    }
    return pools
  }
}
