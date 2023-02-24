/* eslint-disable no-param-reassign */
import { gql } from 'graphql-request'
import { NextApiHandler } from 'next'
import { z } from 'zod'
import { ChainId } from '@pancakeswap/sdk'

import { v3Clients } from 'utils/graphql'
import { TickMath } from '@pancakeswap/v3-sdk'

const zChainId = z.enum(['56', '1', '5', '97'])

const zAddress = z.string().regex(/^0x[a-fA-F0-9]{40}$/)

const zBlockNumber = z
  .string()
  .regex(/^[0-9]+$/)
  .optional()

const zParams = z.object({
  chainId: zChainId,
  address: zAddress,
  blockNumber: zBlockNumber,
})

const cacheTime = {
  [ChainId.ETHEREUM]: 10,
  [ChainId.GOERLI]: 10,
  [ChainId.BSC]: 2,
  [ChainId.BSC_TESTNET]: 2,
}

// currently can get the total active liquidity for a pool
// TODO: v3 farms update subgraph urls
const handler: NextApiHandler = async (req, res) => {
  const parsed = zParams.safeParse(req.query)

  if (parsed.success === false) {
    return res.status(400).json(parsed.error)
  }

  const { chainId, address: address_, blockNumber } = parsed.data

  const address = address_.toLowerCase()
  const ticks = await getPoolTicks(chainId, address, blockNumber?.toString())

  const lastUpdated = new Date().toISOString()

  res.setHeader(
    'Cache-Control',
    `s-maxage=${cacheTime[chainId]}, stale-while-revalidate=${cacheTime[chainId] + cacheTime[chainId] / 2}`,
  )

  return res.status(200).json({
    data: ticks,
    lastUpdated,
    blockNumber,
  })
}

async function getPoolTicks(chainId: string, poolAddress: string, blockNumber?: string) {
  const PAGE_SIZE = 1000
  let allTicks = []
  let lastTick = TickMath.MIN_TICK - 1
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const ticks = await _getPoolTicksGreaterThan(chainId, poolAddress, lastTick, PAGE_SIZE, blockNumber)
    allTicks = [...allTicks, ...ticks]
    const hasMore = ticks.length === PAGE_SIZE

    if (!hasMore) {
      break
    }
    lastTick = Number(ticks[ticks.length - 1].tick)
  }
  return allTicks
}

async function _getPoolTicksGreaterThan(
  chainId: string,
  poolAddress: string,
  tick: number,
  pageSize: number,
  blockNumber?: string,
) {
  const client = v3Clients[<ChainId>(<unknown>chainId)]
  if (!client) {
    return []
  }
  const response = await client.request(
    gql`
        query AllV3Ticks($poolAddress: String!, $lastTick: Int!, $pageSize: Int!) {
          ticks(
            first: $pageSize,
            ${blockNumber ? `block: { number: ${blockNumber} }` : ''}
            where: {
              poolAddress: $poolAddress,
              tickIdx_gt: $lastTick,
            },
            orderBy: tickIdx
          ) {
        tick: tickIdx
        liquidityNet
        liquidityGross
          }
        }
      `,
    {
      poolAddress,
      lastTick: tick,
      pageSize,
    },
  )
  return response.ticks
}

export default handler
