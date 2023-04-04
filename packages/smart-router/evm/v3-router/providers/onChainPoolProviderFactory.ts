import { ChainId, Currency, CurrencyAmount, Pair, JSBI, Percent, BigintIsh } from '@pancakeswap/sdk'
import { Call, createMulticall } from '@pancakeswap/multicall'
import { deserializeToken } from '@pancakeswap/token-lists'
import { computePoolAddress, FeeAmount, DEPLOYER_ADDRESSES, parseProtocolFees } from '@pancakeswap/v3-sdk'

import { OnChainProvider, Pool, PoolType, V2Pool, StablePool, V3Pool } from '../types'
import IPancakePairABI from '../../abis/IPancakePair.json'
import IStablePoolABI from '../../abis/StableSwapPair.json'
import IPancakeV3PoolABI from '../../abis/IPancakeV3Pool.json'
import { getStableSwapPools } from '../../constants/stableSwap'

export const getV2PoolsOnChain = createOnChainPoolFactory<V2Pool>({
  abi: IPancakePairABI,
  getPossiblePoolMetas: ([currencyA, currencyB]) => [
    { address: Pair.getAddress(currencyA.wrapped, currencyB.wrapped), currencyA, currencyB },
  ],
  buildPoolInfoCalls: (address) => [
    {
      address,
      name: 'getReserves',
      params: [],
    },
  ],
  buildPool: ({ currencyA, currencyB }, [reserves]) => {
    if (!reserves) {
      return null
    }
    const { reserve0, reserve1 } = reserves
    const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped)
      ? [currencyA, currencyB]
      : [currencyB, currencyA]
    return {
      type: PoolType.V2,
      reserve0: CurrencyAmount.fromRawAmount(token0, reserve0),
      reserve1: CurrencyAmount.fromRawAmount(token1, reserve1),
    }
  },
})

interface StablePoolMeta extends PoolMeta {
  address: string
}

export const getStablePoolsOnChain = createOnChainPoolFactory<StablePool, StablePoolMeta>({
  abi: IStablePoolABI,
  getPossiblePoolMetas: ([currencyA, currencyB]) => {
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
  buildPoolInfoCalls: (address) => [
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
  buildPool: ({ currencyA, currencyB, address }, [balance0, balance1, a, fee, feeDenominator]) => {
    if (!balance0 || !balance1 || !a || !fee || !feeDenominator) {
      return null
    }
    const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped)
      ? [currencyA, currencyB]
      : [currencyB, currencyA]
    return {
      address,
      type: PoolType.STABLE,
      balances: [CurrencyAmount.fromRawAmount(token0, balance0), CurrencyAmount.fromRawAmount(token1, balance1)],
      amplifier: JSBI.BigInt(a),
      fee: new Percent(JSBI.BigInt(fee), JSBI.BigInt(feeDenominator)),
    }
  },
})

interface PoolMeta {
  currencyA: Currency
  currencyB: Currency
  address: string
}

export interface V3PoolMeta extends PoolMeta {
  fee: FeeAmount
}

export const getV3PoolsWithoutTicksOnChain = createOnChainPoolFactory<V3Pool, V3PoolMeta>({
  abi: IPancakeV3PoolABI,
  getPossiblePoolMetas: ([currencyA, currencyB]) => {
    const deployerAddress = DEPLOYER_ADDRESSES[currencyA.chainId as ChainId]
    if (!deployerAddress) {
      return []
    }
    return [FeeAmount.LOWEST, FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH].map((fee) => ({
      address: computePoolAddress({
        deployerAddress,
        tokenA: currencyA.wrapped,
        tokenB: currencyB.wrapped,
        fee,
      }),
      currencyA,
      currencyB,
      fee,
    }))
  },
  buildPoolInfoCalls: (address) => [
    {
      address,
      name: 'liquidity',
      params: [],
    },
    {
      address,
      name: 'slot0',
      params: [],
    },
  ],
  buildPool: ({ currencyA, currencyB, fee, address }, [liquidity, slot0]) => {
    if (!liquidity || !slot0) {
      return null
    }
    const { sqrtPriceX96, tick, feeProtocol } = slot0
    const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped)
      ? [currencyA, currencyB]
      : [currencyB, currencyA]
    const [token0ProtocolFee, token1ProtocolFee] = parseProtocolFees(feeProtocol)
    return {
      type: PoolType.V3,
      token0,
      token1,
      fee,
      liquidity: JSBI.BigInt(liquidity),
      sqrtRatioX96: JSBI.BigInt(sqrtPriceX96),
      tick: Number(tick),
      address,
      token0ProtocolFee,
      token1ProtocolFee,
    }
  },
})

interface OnChainPoolFactoryParams<TPool extends Pool, TPoolMeta extends PoolMeta> {
  abi: any[]
  getPossiblePoolMetas: (pair: [Currency, Currency]) => TPoolMeta[]
  buildPoolInfoCalls: (poolAddress: string) => Call[]
  buildPool: (poolMeta: TPoolMeta, data: any[]) => TPool | null
}

function createOnChainPoolFactory<TPool extends Pool, TPoolMeta extends PoolMeta = PoolMeta>({
  abi,
  getPossiblePoolMetas,
  buildPoolInfoCalls,
  buildPool,
}: OnChainPoolFactoryParams<TPool, TPoolMeta>) {
  return async function poolFactory(
    pairs: [Currency, Currency][],
    provider: OnChainProvider,
    blockNumber: BigintIsh,
  ): Promise<TPool[]> {
    const chainId: ChainId = pairs[0]?.[0]?.chainId
    if (!chainId) {
      return []
    }

    const { multicallv2 } = createMulticall(provider)
    const poolAddressSet = new Set<string>()

    const poolMetas: TPoolMeta[] = []
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

    if (!calls.length) {
      return []
    }

    const results = await multicallv2({
      abi,
      calls,
      chainId,
      options: {
        requireSuccess: false,
        blockTag: JSBI.toNumber(JSBI.BigInt(blockNumber)),
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
