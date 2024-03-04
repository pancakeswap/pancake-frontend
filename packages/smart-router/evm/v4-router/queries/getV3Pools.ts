import { ChainId } from '@pancakeswap/chains'
import { BigintIsh, Currency } from '@pancakeswap/sdk'
import { FeeAmount, TICK_SPACINGS, Tick } from '@pancakeswap/v3-sdk'
import { multicallByGasLimit } from '@pancakeswap/multicall'
import { encodeFunctionData, decodeFunctionResult, Address } from 'viem'

import { OnChainProvider, V3Pool } from '../../v3-router/types'
import { getV3PoolsWithoutTicksOnChain } from '../../v3-router/providers'
import { tickLensAbi } from '../../abis/ITickLens'
import { V3_TICK_LENS_ADDRESSES } from '../../constants'
import { getPairCombinations } from '../../v3-router/functions'
import { getV3PoolFetchConfig } from '../constants'

type WithMulticallGasLimit = {
  gasLimit?: BigintIsh
}

type WithClientProvider = {
  clientProvider?: OnChainProvider
}

export type GetV3CandidatePoolsParams = {
  currencyA?: Currency
  currencyB?: Currency
} & WithClientProvider &
  WithMulticallGasLimit

export async function getV3CandidatePools({
  currencyA,
  currencyB,
  clientProvider,
  gasLimit,
}: GetV3CandidatePoolsParams) {
  const pairs = getPairCombinations(currencyA, currencyB)
  return getV3Pools({ pairs, clientProvider, gasLimit })
}

export type GetV3PoolsParams = {
  pairs?: [Currency, Currency][]
} & WithClientProvider &
  WithMulticallGasLimit

export async function getV3Pools({ pairs, clientProvider, gasLimit }: GetV3PoolsParams) {
  const pools = await getV3PoolsWithoutTicksOnChain(pairs || [], clientProvider)
  if (!pools.length) {
    return pools
  }
  return fillPoolsWithTicks({ pools, clientProvider, gasLimit })
}

function getBitmapIndex(tick: number, tickSpacing: number) {
  return Math.floor(tick / tickSpacing / 256)
}

type GetBitmapIndexListParams = {
  currentTick: number
  fee: FeeAmount
}

function createBitmapIndexListBuilder(tickRange: number) {
  return function buildBitmapIndexList<T>({ currentTick, fee, ...rest }: GetBitmapIndexListParams & T) {
    const tickSpacing = TICK_SPACINGS[fee]
    const minIndex = getBitmapIndex(currentTick - tickRange, tickSpacing)
    const maxIndex = getBitmapIndex(currentTick + tickRange, tickSpacing)
    return Array.from(Array(maxIndex - minIndex + 1), (_, i) => ({
      bitmapIndex: minIndex + i,
      ...rest,
    }))
  }
}

// only allow 10% slippage
const buildBitmapIndexList = createBitmapIndexListBuilder(1000)

type FillPoolsWithTicksParams = {
  pools: V3Pool[]
} & WithClientProvider &
  WithMulticallGasLimit

async function fillPoolsWithTicks({ pools, clientProvider, gasLimit }: FillPoolsWithTicksParams): Promise<V3Pool[]> {
  const chainId: ChainId = pools[0]?.token0.chainId
  const tickLensAddress = V3_TICK_LENS_ADDRESSES[chainId]
  const client = clientProvider?.({ chainId })
  if (!client || !tickLensAddress) {
    throw new Error('Fill pools with ticks failed. No valid public client or tick lens found.')
  }
  const { gasLimit: gasLimitPerCall, retryGasMultiplier } = getV3PoolFetchConfig(chainId)
  const bitmapIndexes = pools
    .map(({ tick, fee }, i) => buildBitmapIndexList<{ poolIndex: number }>({ currentTick: tick, fee, poolIndex: i }))
    .reduce<{ bitmapIndex: number; poolIndex: number }[]>((acc, cur) => [...acc, ...cur], [])
  const res = await multicallByGasLimit(
    bitmapIndexes.map(({ poolIndex, bitmapIndex }) => ({
      target: tickLensAddress as Address,
      callData: encodeFunctionData({
        abi: tickLensAbi,
        args: [pools[poolIndex].address, bitmapIndex],
        functionName: 'getPopulatedTicksInWord',
      }),
      gasLimit: gasLimitPerCall,
    })),
    {
      chainId,
      client,
      gasLimit,
      retryFailedCallsWithGreaterLimit: {
        gasLimitMultiplier: retryGasMultiplier,
      },
    },
  )
  const poolsWithTicks = pools.map((p) => ({ ...p }))
  for (const [index, result] of res.results.entries()) {
    const { poolIndex } = bitmapIndexes[index]
    const pool = poolsWithTicks[poolIndex]
    const data = result.success
      ? decodeFunctionResult({
          abi: tickLensAbi,
          functionName: 'getPopulatedTicksInWord',
          data: result.result as `0x${string}`,
        })
      : undefined
    const newTicks = data
      ?.map(
        ({ tick, liquidityNet, liquidityGross }) =>
          new Tick({
            index: tick,
            liquidityNet,
            liquidityGross,
          }),
      )
      .reverse()
    if (!newTicks) {
      continue
    }
    pool.ticks = [...(pool.ticks || []), ...newTicks]
  }
  // Filter those pools with no ticks found
  return poolsWithTicks.filter((p) => p.ticks?.length)
}
