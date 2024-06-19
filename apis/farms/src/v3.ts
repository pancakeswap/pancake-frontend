/* eslint-disable no-param-reassign, no-await-in-loop */
import { ChainId, getMainnetChainNameInKebabCase } from '@pancakeswap/chains'
import { masterChefV3Addresses } from '@pancakeswap/farms'
import { ERC20Token } from '@pancakeswap/sdk'
import { CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import { PositionMath } from '@pancakeswap/v3-sdk'
import { Request } from 'itty-router'
import { error, json } from 'itty-router-extras'
import { Address } from 'viem'
import { z } from 'zod'

import { FarmKV } from './kv'
import { viemProviders } from './provider'

export const V3_SUBGRAPH_CLIENTS_CHAIN_IDS = [
  ChainId.ETHEREUM,
  ChainId.GOERLI,
  ChainId.BSC,
  ChainId.POLYGON_ZKEVM,
  ChainId.ZKSYNC,
  ChainId.ARBITRUM_ONE,
  ChainId.LINEA,
  ChainId.BASE,
  ChainId.OPBNB,
] as const

type SupportChainId = (typeof V3_SUBGRAPH_CLIENTS_CHAIN_IDS)[number]

const zChainId = z.enum(V3_SUBGRAPH_CLIENTS_CHAIN_IDS.map((chainId) => String(chainId)) as [string, ...string[]])

const zAddress = z.string().regex(/^0x[a-fA-F0-9]{40}$/)

const zParams = z.object({
  chainId: zChainId,
  address: zAddress,
})

const v3PoolAbi = [
  {
    inputs: [],
    name: 'slot0',
    outputs: [
      {
        internalType: 'uint160',
        name: 'sqrtPriceX96',
        type: 'uint160',
      },
      {
        internalType: 'int24',
        name: 'tick',
        type: 'int24',
      },
      {
        internalType: 'uint16',
        name: 'observationIndex',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: 'observationCardinality',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: 'observationCardinalityNext',
        type: 'uint16',
      },
      {
        internalType: 'uint32',
        name: 'feeProtocol',
        type: 'uint32',
      },
      {
        internalType: 'bool',
        name: 'unlocked',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const masterchefV3Abi = [
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'poolInfo',
    outputs: [
      { internalType: 'uint256', name: 'allocPoint', type: 'uint256' },
      { internalType: 'contract IPancakeV3Pool', name: 'v3Pool', type: 'address' },
      { internalType: 'address', name: 'token0', type: 'address' },
      { internalType: 'address', name: 'token1', type: 'address' },
      { internalType: 'uint24', name: 'fee', type: 'uint24' },
      { internalType: 'uint256', name: 'totalLiquidity', type: 'uint256' },
      { internalType: 'uint256', name: 'totalBoostLiquidity', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'v3PoolAddressPid',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const CACHE_TIME = {
  short: 's-maxage=30, max-age=20, stale-while-revalidate=120',
  long: 's-maxage=300, max-age=150, stale-while-revalidate=1200',
}

// getting active "in-range" liquidity for a pool
export const handler = async (req: Request, event: FetchEvent) => {
  const cache = caches.default
  const cacheResponse = await cache.match(event.request)

  let response: Response | undefined

  if (!cacheResponse) {
    response = await handler_(req, event)
    if (response.status === 200) {
      event.waitUntil(cache.put(event.request, response.clone()))
    }
  } else {
    response = new Response(cacheResponse.body, cacheResponse)
  }

  return response
}

const handler_ = async (req: Request, event: FetchEvent) => {
  const parsed = zParams.safeParse(req.params)

  if (parsed.success === false) {
    return error(400, parsed.error)
  }

  const { chainId: chainIdString, address: address_ } = parsed.data
  const chainId = Number(chainIdString) as SupportChainId

  const address = address_.toLowerCase()

  const masterChefV3Address = masterChefV3Addresses[chainId]

  const client = viemProviders({ chainId })

  const [pid] = await client.multicall({
    contracts: [
      {
        abi: masterchefV3Abi,
        address: masterChefV3Address,
        functionName: 'v3PoolAddressPid',
        args: [address as `0x${string}`],
      },
    ],
    allowFailure: false,
  })

  if (typeof pid !== 'bigint') {
    return error(400, { error: 'Invalid LP address' })
  }

  const [slot0, poolInfo] = await client.multicall({
    contracts: [
      { abi: v3PoolAbi, address: address as Address, functionName: 'slot0' },
      {
        abi: masterchefV3Abi,
        address: masterChefV3Address,
        functionName: 'poolInfo',
        args: [pid],
      },
    ],
    allowFailure: false,
  })

  if (!slot0) {
    return error(404, { error: 'Slot0 not found' })
  }

  if (!poolInfo) {
    return error(404, { error: 'PoolInfo not found' })
  }

  const kvCache = await FarmKV.getV3Liquidity(chainId, address)

  if (kvCache) {
    // 5 mins
    if (new Date().getTime() < new Date(kvCache.updatedAt).getTime() + 1000 * 60 * 5) {
      return json(
        {
          tvl: {
            token0: kvCache.tvl.token0,
            token1: kvCache.tvl.token1,
          },
          formatted: {
            token0: kvCache.formatted.token0,
            token1: kvCache.formatted.token1,
          },
          updatedAt: kvCache.updatedAt,
        },
        {
          headers: {
            'Cache-Control': CACHE_TIME.short,
          },
        },
      )
    }
  }

  try {
    const [allocPoint, , , , , totalLiquidity] = poolInfo
    const [sqrtPriceX96, tick] = slot0

    // don't cache when pool is not active or has no liquidity
    if (!allocPoint || !totalLiquidity) {
      return json(
        {
          tvl: {
            token0: '0',
            token1: '0',
          },
          formatted: {
            token0: '0',
            token1: '0',
          },
          updatedAt: new Date().toISOString(),
        },
        {
          headers: {
            'Cache-Control': 'no-cache',
          },
        },
      )
    }

    const resultTimeout = await Promise.race([
      timeout(20),
      fetchLiquidityFromExplorer(chainId, address, masterChefV3Address, tick, sqrtPriceX96),
    ])

    if (!resultTimeout) {
      throw new Error('Timeout')
    }

    const { allActivePositions, result } = resultTimeout

    if (allActivePositions.length === 0) {
      return json(
        {
          tvl: {
            token0: '0',
            token1: '0',
          },
          formatted: {
            token0: '0',
            token1: '0',
          },
          updatedAt: new Date().toISOString(),
        },
        {
          headers: {
            'Cache-Control': 'no-cache',
          },
        },
      )
    }

    if (!result) {
      throw new Error('No result')
    }

    event.waitUntil(FarmKV.saveV3Liquidity(chainId, address, result))

    return json(result, {
      headers: {
        'Cache-Control': allActivePositions.length > 50 ? CACHE_TIME.long : CACHE_TIME.short,
      },
    })
  } catch (e) {
    console.error('fetching error falling back to kv cache if any', e)

    if (kvCache) {
      return json(
        {
          tvl: {
            token0: kvCache.tvl.token0,
            token1: kvCache.tvl.token1,
          },
          formatted: {
            token0: kvCache.formatted.token0,
            token1: kvCache.formatted.token1,
          },
          updatedAt: kvCache.updatedAt,
        },
        {
          headers: {
            'Cache-Control': CACHE_TIME.short,
          },
        },
      )
    }

    return error(500, { error: 'Failed to get active liquidity' })
  }
}

async function fetchLiquidityFromExplorer(
  chainId: (typeof V3_SUBGRAPH_CLIENTS_CHAIN_IDS)[number],
  address: string,
  masterChefV3Address: string,
  tick: number,
  sqrtPriceX96: bigint,
) {
  const updatedAt = new Date().toISOString()
  let allActivePositions: any[] = []

  const chainName = getMainnetChainNameInKebabCase(chainId)
  const pool: {
    token0: {
      id: Address
      decimals: number
    }
    token1: {
      id: Address
      decimals: number
    }
  } = await fetch(`${EXPLORER_URL}/cached/pools/v3/${chainName}/${address}`, {
    headers: {
      'x-api-key': EXPLORER_API_KEY,
      'Content-Type': 'application/json',
    },
  }).then((res) => {
    return res.json()
  })

  if (!pool) {
    throw new Error('Pool not found')
  }

  let hasNextPage = true
  let cursor: string | undefined

  while (hasNextPage) {
    // eslint-disable-next-line no-await-in-loop
    const positions: any = await getPositionByMasterChefId(cursor)
    allActivePositions = [...allActivePositions, ...positions.rows]
    // eslint-disable-next-line prefer-destructuring
    hasNextPage = positions.hasNextPage
    // eslint-disable-next-line prefer-destructuring
    cursor = positions.endCursor
  }

  async function getPositionByMasterChefId(after?: string) {
    return fetch(
      `${EXPLORER_URL}/cached/pools/positions/v3/${chainName}/${address}?owner=${masterChefV3Address.toLowerCase()}${
        after ? `&after=${after}` : ''
      }`,
      {
        headers: {
          'x-api-key': EXPLORER_API_KEY,
          'Content-Type': 'application/json',
        },
      },
    ).then((res) => res.json())
  }

  console.info('fetching farms active liquidity', {
    address,
    chainId,
    allActivePositions: allActivePositions.length,
  })

  if (allActivePositions.length === 0) {
    return {
      allActivePositions,
    }
  }

  const currentTick = tick
  const sqrtRatio = sqrtPriceX96

  let totalToken0 = 0n
  let totalToken1 = 0n

  for (const position of allActivePositions.filter(
    // double check that the position is within the current tick range
    (p) => +p.lowerTickIdx <= currentTick && +p.upperTickIdx > currentTick,
  )) {
    const token0 = PositionMath.getToken0Amount(
      currentTick,
      +position.lowerTickIdx,
      +position.upperTickIdx,
      sqrtRatio,
      BigInt(position.liquidity),
    )

    const token1 = PositionMath.getToken1Amount(
      currentTick,
      +position.lowerTickIdx,
      +position.upperTickIdx,
      sqrtRatio,
      BigInt(position.liquidity),
    )
    totalToken0 += token0
    totalToken1 += token1
  }

  const curr0 = CurrencyAmount.fromRawAmount(
    new ERC20Token(+chainId, pool.token0.id, +pool.token0.decimals, '0'),
    totalToken0.toString(),
  ).toExact()
  const curr1 = CurrencyAmount.fromRawAmount(
    new ERC20Token(+chainId, pool.token1.id, +pool.token1.decimals, '1'),
    totalToken1.toString(),
  ).toExact()

  const result = {
    tvl: {
      token0: totalToken0.toString(),
      token1: totalToken1.toString(),
    },
    formatted: {
      token0: curr0,
      token1: curr1,
    },
    updatedAt,
  }
  return {
    result,
    allActivePositions,
  }
}

function timeout(seconds: number) {
  return new Promise<null>((resolve) =>
    setTimeout(() => {
      resolve(null)
    }, seconds * 1_000),
  )
}
