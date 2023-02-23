/* eslint-disable no-param-reassign */
import { gql } from 'graphql-request'
import { NextApiHandler } from 'next'
import { z } from 'zod'
import { ChainId } from '@pancakeswap/sdk'

import { swapClientWithChain } from 'utils/graphql'

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
  const BATCH_PAGE = 3
  const PAGE_SIZE = 1000
  let result: any[] = []
  let page = 0
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const pageNums = Array(BATCH_PAGE)
      .fill(page)
      .map((p, i) => p + i)
    // eslint-disable-next-line no-await-in-loop
    const poolsCollections = await Promise.all(
      pageNums.map((p) => _getPoolTicksByPage(chainId, poolAddress, p, PAGE_SIZE, blockNumber)),
    )

    let hasMore = true
    for (const pools of poolsCollections) {
      result = [...result, ...pools]
      if (pools.length !== PAGE_SIZE) {
        hasMore = false
      }
    }
    if (!hasMore) {
      break
    }

    page += BATCH_PAGE
  }
  return result
}

async function _getPoolTicksByPage(
  chainId: string,
  poolAddress: string,
  page: number,
  pageSize: number,
  blockNumber?: string,
) {
  const client = swapClientWithChain(<ChainId>(<unknown>chainId))
  if (!client) {
    return []
  }
  const response = await client.request(
    gql`
        query AllV3Ticks($poolAddress: String!, $skip: Int!, $pageSize: Int!) {
          ticks(
            first: 1000,
            ${blockNumber ? `block: { number: ${blockNumber} }` : ''}
            skip: $skip,
            where: { poolAddress: $poolAddress },
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
      skip: page * pageSize,
      pageSize,
    },
  )
  return response.ticks
}

export default handler
