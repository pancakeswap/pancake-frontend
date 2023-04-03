/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
import { NextApiHandler } from 'next'
import { PositionMath } from '@pancakeswap/v3-sdk'
import { farmsV3ConfigChainMap } from '@pancakeswap/farms/constants/v3'
import { JSBI, CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import { z } from 'zod'
import { BigNumber } from '@ethersproject/bignumber'
import { request, gql } from 'graphql-request'
import { masterChefV3Addresses } from '@pancakeswap/farms'
import { V3_SUBGRAPH_URLS } from 'config/constants/endpoints'
import { multicallv3Typed } from 'utils/multicall'

const zChainId = z.enum(['56', '1', '5', '97'])

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
] as const

const CACHE_TIME = {
  short: 's-maxage=30, max-age=20, stale-while-revalidate=120',
  long: 's-maxage=300, max-age=150, stale-while-revalidate=1200',
}

// getting active "in-range" liquidity for a pool
const handler: NextApiHandler = async (req, res) => {
  const parsed = zParams.safeParse(req.query)

  if (parsed.success === false) {
    return res.status(400).json(parsed.error)
  }

  const { chainId, address: address_ } = parsed.data

  const farms = farmsV3ConfigChainMap[chainId]

  const address = address_.toLowerCase()

  const farm = farms.find((f) => f.lpAddress.toLowerCase() === address)

  if (!farm) {
    return res.status(400).json({ error: 'Invalid LP address' })
  }

  const masterChefV3Address = masterChefV3Addresses[chainId]

  const [slot0, poolInfo] = await multicallv3Typed({
    calls: [
      { abi: v3PoolAbi, address, name: 'slot0' },
      {
        abi: masterchefV3Abi,
        address: masterChefV3Address,
        name: 'poolInfo',
        params: [BigNumber.from(farm.pid)],
      },
    ],
    chainId: +chainId,
    allowFailure: false,
  })

  if (!slot0) {
    return res.status(404).json({ error: 'Slot0 not found' })
  }

  if (!poolInfo) {
    return res.status(404).json({ error: 'PoolInfo not found' })
  }

  const updatedAt = new Date().toISOString()

  // don't cache when pool is not active or has no liquidity
  if (poolInfo.allocPoint.isZero() || poolInfo.totalLiquidity.isZero()) {
    return res.status(200).json({
      tvl: {
        token0: '0',
        token1: '0',
      },
      formatted: {
        token0: '0',
        token1: '0',
      },
      updatedAt,
    })
  }

  let allActivePositions = []

  async function fetchPositionByMasterChefId(posId = '0') {
    const resp = await request(
      V3_SUBGRAPH_URLS[chainId],
      gql`
        query tvl($poolAddress: String!, $owner: String!, $posId: String!, $currentTick: String!) {
          positions(
            where: { pool: $poolAddress, liquidity_gt: "0", owner: $owner, id_gt: $posId }
            first: 1000
            orderBy: id
            tickLower_: { tickIdx_lte: currentTick }
            tickUpper_: { tickIdx_gt: currentTick }
          ) {
            liquidity
            id
            tickUpper {
              tickIdx
            }
            tickLower {
              tickIdx
            }
          }
        }
      `,
      {
        poolAddress: address,
        owner: masterChefV3Address.toLowerCase(),
        currentTick: slot0.tick.toString(),
        posId,
      },
    )

    return resp.positions
  }

  let posId = '0'

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const pos = await fetchPositionByMasterChefId(posId)
    allActivePositions = [...allActivePositions, ...pos]
    if (pos.length < 1000) {
      break
    }
    posId = pos[pos.length - 1].id
  }

  console.info('fetching farms active liquidity', {
    address,
    chainId,
    allActivePositions: allActivePositions.length,
  })

  if (allActivePositions.length === 0) {
    return res.status(200).json({
      tvl: {
        token0: '0',
        token1: '0',
      },
      formatted: {
        token0: '0',
        token1: '0',
      },
      updatedAt,
    })
  }

  const currentTick = slot0.tick
  const sqrtRatio = JSBI.BigInt(slot0.sqrtPriceX96.toString())

  let totalToken0 = JSBI.BigInt(0)
  let totalToken1 = JSBI.BigInt(0)

  for (const position of allActivePositions.filter(
    // double check that the position is within the current tick range
    (p) => +p.tickLower.tickIdx <= slot0.tick && +p.tickUpper.tickIdx > slot0.tick,
  )) {
    const token0 = PositionMath.getToken0Amount(
      currentTick,
      +position.tickLower.tickIdx,
      +position.tickUpper.tickIdx,
      sqrtRatio,
      JSBI.BigInt(position.liquidity),
    )

    const token1 = PositionMath.getToken1Amount(
      currentTick,
      +position.tickLower.tickIdx,
      +position.tickUpper.tickIdx,
      sqrtRatio,
      JSBI.BigInt(position.liquidity),
    )
    totalToken0 = JSBI.add(totalToken0, token0)
    totalToken1 = JSBI.add(totalToken1, token1)
  }

  const curr0 = CurrencyAmount.fromRawAmount(farm.token, totalToken0.toString()).toExact()
  const curr1 = CurrencyAmount.fromRawAmount(farm.quoteToken, totalToken1.toString()).toExact()

  res.setHeader('Cache-Control', allActivePositions.length > 50 ? CACHE_TIME.long : CACHE_TIME.short)

  return res.status(200).json({
    tvl: {
      token0: totalToken0.toString(),
      token1: totalToken1.toString(),
    },
    formatted: {
      token0: curr0,
      token1: curr1,
    },
    updatedAt,
  })
}

export default handler
