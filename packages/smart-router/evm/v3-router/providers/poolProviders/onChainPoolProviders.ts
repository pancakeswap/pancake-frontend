import { ChainId } from '@pancakeswap/chains'
import { BigintIsh, Currency, CurrencyAmount, Percent, erc20Abi } from '@pancakeswap/sdk'
import { getStableSwapPools } from '@pancakeswap/stable-swap-sdk'
import { deserializeToken } from '@pancakeswap/token-lists'
import { DEPLOYER_ADDRESSES, FeeAmount, pancakeV3PoolABI, parseProtocolFees } from '@pancakeswap/v3-sdk'
import { Abi, Address } from 'viem'

import { pancakePairABI } from '../../../abis/IPancakePair'
import { stableSwapPairABI } from '../../../abis/StableSwapPair'
import { OnChainProvider, Pool, PoolType, StablePool, V2Pool, V3Pool } from '../../types'
import { computeV2PoolAddress, computeV3PoolAddress } from '../../utils'
import { PoolMeta, V3PoolMeta } from './internalTypes'

export const getV2PoolsOnChain = createOnChainPoolFactory<V2Pool, PoolMeta>({
  abi: pancakePairABI,
  getPossiblePoolMetas: ([currencyA, currencyB]) => [
    { address: computeV2PoolAddress(currencyA.wrapped, currencyB.wrapped), currencyA, currencyB },
  ],
  buildPoolInfoCalls: ({ address }) => [
    {
      address,
      functionName: 'getReserves',
      args: [],
    },
  ],
  buildPool: ({ currencyA, currencyB }, [reserves]) => {
    if (!reserves) {
      return null
    }
    const [reserve0, reserve1] = reserves
    const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped)
      ? [currencyA, currencyB]
      : [currencyB, currencyA]
    return {
      type: PoolType.V2,
      reserve0: CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
      reserve1: CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
    }
  },
})

export const getStablePoolsOnChain = createOnChainPoolFactory<StablePool, PoolMeta>({
  abi: stableSwapPairABI,
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
  buildPoolInfoCalls: ({ address }) => [
    {
      address,
      functionName: 'balances',
      args: [0],
    },
    {
      address,
      functionName: 'balances',
      args: [1],
    },
    {
      address,
      functionName: 'A',
      args: [],
    },
    {
      address,
      functionName: 'fee',
      args: [],
    },
    {
      address,
      functionName: 'FEE_DENOMINATOR',
      args: [],
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
      balances: [
        CurrencyAmount.fromRawAmount(token0, balance0.toString()),
        CurrencyAmount.fromRawAmount(token1, balance1.toString()),
      ],
      amplifier: BigInt(a.toString()),
      fee: new Percent(BigInt(fee.toString()), BigInt(feeDenominator.toString())),
    }
  },
})

export const getV3PoolsWithoutTicksOnChain = createOnChainPoolFactory<V3Pool, V3PoolMeta>({
  abi: pancakeV3PoolABI,
  getPossiblePoolMetas: ([currencyA, currencyB]) => {
    const deployerAddress = DEPLOYER_ADDRESSES[currencyA.chainId as ChainId]
    if (!deployerAddress) {
      return []
    }
    return [FeeAmount.LOWEST, FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH].map((fee) => ({
      address: computeV3PoolAddress({
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
  buildPoolInfoCalls: ({ address, currencyA, currencyB }) => [
    {
      address,
      functionName: 'liquidity',
    },
    {
      address,
      functionName: 'slot0',
    },
    {
      abi: erc20Abi,
      address: currencyA.wrapped.address,
      functionName: 'balanceOf',
      args: [address],
    },
    {
      abi: erc20Abi,
      address: currencyB.wrapped.address,
      functionName: 'balanceOf',
      args: [address],
    },
  ],
  buildPool: ({ currencyA, currencyB, fee, address }, [liquidity, slot0, balanceA, balanceB]) => {
    if (!slot0) {
      return null
    }
    const [sqrtPriceX96, tick, , , , feeProtocol] = slot0
    const sorted = currencyA.wrapped.sortsBefore(currencyB.wrapped)
    const [balance0, balance1] = sorted ? [balanceA, balanceB] : [balanceB, balanceA]
    const [token0, token1] = sorted ? [currencyA, currencyB] : [currencyB, currencyA]
    const [token0ProtocolFee, token1ProtocolFee] = parseProtocolFees(feeProtocol)
    return {
      type: PoolType.V3,
      token0,
      token1,
      reserve0: CurrencyAmount.fromRawAmount(token0, balance0),
      reserve1: CurrencyAmount.fromRawAmount(token1, balance1),
      fee,
      liquidity: BigInt(liquidity.toString()),
      sqrtRatioX96: BigInt(sqrtPriceX96.toString()),
      tick: Number(tick),
      address,
      token0ProtocolFee,
      token1ProtocolFee,
    }
  },
})

// maybe add back strict type later
type ContractFunctionConfig = {
  abi?: Abi
  address: Address
  functionName: string
  args?: any[]
}

interface OnChainPoolFactoryParams<TPool extends Pool, TPoolMeta extends PoolMeta, TAbi extends Abi | unknown[] = Abi> {
  abi: TAbi
  getPossiblePoolMetas: (pair: [Currency, Currency]) => TPoolMeta[]
  buildPoolInfoCalls: (poolMeta: TPoolMeta) => ContractFunctionConfig[]
  buildPool: (poolMeta: TPoolMeta, data: any[]) => TPool | null
}

function createOnChainPoolFactory<
  TPool extends Pool,
  TPoolMeta extends PoolMeta = PoolMeta,
  TAbi extends Abi | unknown[] = Abi,
>({ abi, getPossiblePoolMetas, buildPoolInfoCalls, buildPool }: OnChainPoolFactoryParams<TPool, TPoolMeta, TAbi>) {
  return async function poolFactory(
    pairs: [Currency, Currency][],
    provider?: OnChainProvider,
    blockNumber?: BigintIsh,
  ): Promise<TPool[]> {
    if (!provider) {
      throw new Error('No valid onchain data provider')
    }

    const chainId: ChainId = pairs[0]?.[0]?.chainId
    const client = provider({ chainId })
    if (!chainId || !client) {
      return []
    }

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

    let calls: ContractFunctionConfig[] = []
    let poolCallSize = 0
    for (const meta of poolMetas) {
      const poolCalls = buildPoolInfoCalls(meta)
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

    const results = await client.multicall({
      contracts: calls.map((call) => ({
        abi: call.abi || (abi as any),
        address: call.address as `0x${string}`,
        functionName: call.functionName,
        args: call.args as any,
      })),
      allowFailure: true,
      blockNumber: blockNumber ? BigInt(Number(BigInt(blockNumber))) : undefined,
    })

    const pools: TPool[] = []
    for (let i = 0; i < poolMetas.length; i += 1) {
      const poolResults = results.slice(i * poolCallSize, (i + 1) * poolCallSize)
      const pool = buildPool(
        poolMetas[i],
        poolResults.map((result) => result.result),
      )
      if (pool) {
        pools.push(pool)
      }
    }
    return pools
  }
}
