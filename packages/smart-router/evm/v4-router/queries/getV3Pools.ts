import { ChainId } from '@pancakeswap/chains'
import { Currency } from '@pancakeswap/sdk'
import { FeeAmount, TICK_SPACINGS, Tick } from '@pancakeswap/v3-sdk'
import { multicallByGasLimit } from '@pancakeswap/multicall'
import { encodeFunctionData, decodeFunctionResult, Address } from 'viem'

import { OnChainProvider, V3Pool } from '../../v3-router/types'
import { getV3PoolsWithoutTicksOnChain } from '../../v3-router/providers'
import { tickLensAbi } from '../../abis/ITickLens'
import { V3_TICK_LENS_ADDRESSES } from '../../constants'
import { getPairCombinations } from '../../v3-router/functions'

type WithClientProvider = {
  clientProvider?: OnChainProvider
}

export type GetV3CandidatePoolsParams = {
  currencyA?: Currency
  currencyB?: Currency
} & WithClientProvider

export async function getV3CandidatePools({ currencyA, currencyB, clientProvider }: GetV3CandidatePoolsParams) {
  const pairs = getPairCombinations(currencyA, currencyB)
  return getV3Pools({ pairs, clientProvider })
}

export type GetV3PoolsParams = {
  pairs?: [Currency, Currency][]
} & WithClientProvider

export async function getV3Pools({ pairs, clientProvider }: GetV3PoolsParams) {
  const pools = await getV3PoolsWithoutTicksOnChain(pairs || [], clientProvider)
  return fillPoolsWithTicks({ pools, clientProvider })
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
} & WithClientProvider

async function fillPoolsWithTicks({ pools, clientProvider }: FillPoolsWithTicksParams): Promise<V3Pool[]> {
  const chainId: ChainId = pools[0]?.token0.chainId
  const tickLensAddress = V3_TICK_LENS_ADDRESSES[chainId]
  const client = clientProvider?.({ chainId })
  if (!client || !tickLensAddress) {
    throw new Error('Fill pools with ticks failed. No valid public client or tick lens found.')
  }
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
      // TODO: find out an appropriate number for the gas limit
      // Better have retry strategy applied for failed calls
      gasLimit: 3500000n,
    })),
    {
      chainId,
      client,
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
    const tick = data?.[0]
      ? new Tick({
          index: data[0].tick,
          liquidityNet: data[0].liquidityNet,
          liquidityGross: data[0].liquidityGross,
        })
      : undefined
    if (!tick) {
      continue
    }
    pool.ticks = [...(pool.ticks || []), tick]
  }
  // Filter those pools with no ticks found
  return poolsWithTicks.filter((p) => p.ticks?.length)
}
