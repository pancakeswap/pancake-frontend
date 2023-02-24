/* eslint-disable no-param-reassign */
import { NextApiHandler } from 'next'
import { PositionMath } from '@pancakeswap/v3-sdk'
import { farmsV3Map } from '@pancakeswap/farms/constants/index.v3'
import { JSBI, Token, CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import { z } from 'zod'
import { request, gql } from 'graphql-request'
import { masterChefV3Addresses } from '@pancakeswap/farms'
import { V3_SUBGRAPH_URLS } from 'config/constants/endpoints'

const zChainId = z.enum(['56', '1', '5', '97'])

const zAddress = z.string().regex(/^0x[a-fA-F0-9]{40}$/)

const zParams = z.object({
  chainId: zChainId,
  address: zAddress,
})

// currently can get the total active liquidity for a pool
// TODO: v3 farms update subgraph urls
const handler: NextApiHandler = async (req, res) => {
  const parsed = zParams.safeParse(req.query)

  if (parsed.success === false) {
    return res.status(400).json(parsed.error)
  }

  const { chainId, address: address_ } = parsed.data

  const farms = farmsV3Map[chainId]

  const address = address_.toLowerCase()

  if (!farms.some((f) => f.lpAddress.toLowerCase() === address)) {
    return res.status(400).json({ error: 'Invalid LP address' })
  }

  const masterChefV3Address = masterChefV3Addresses[chainId]

  const response = await request(
    V3_SUBGRAPH_URLS[chainId],
    gql`
    query tvl {
        pool(id: "${address}") {
          tick
          sqrtPrice
          token0 {
            id
            symbol
            decimals
          }
          token1 {
            id
            symbol
            decimals
          }
        }
        positions(where: { pool: "${address}", liquidity_gt: "0", owner: "${masterChefV3Address.toLowerCase()}" }, first: 1000, orderBy: liquidity orderDirection: desc) {
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
  )

  const { pool, positions } = response

  const currentTick = pool.tick
  const sqrtRatio = JSBI.BigInt(pool.sqrtPrice)

  let totalToken0 = JSBI.BigInt(0)
  let totalToken1 = JSBI.BigInt(0)

  for (const position of positions) {
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

  const curr0 = CurrencyAmount.fromRawAmount(
    new Token(+chainId, pool.token0.id, +pool.token0.decimals, pool.token0.symbol),
    totalToken0.toString(),
  ).toExact()
  const curr1 = CurrencyAmount.fromRawAmount(
    new Token(+chainId, pool.token1.id, +pool.token1.decimals, pool.token1.symbol),
    totalToken1.toString(),
  ).toExact()

  const lastUpdated = new Date().toISOString()

  res.setHeader('Cache-Control', 's-maxage=300, max-age=300')

  return res.status(200).json({
    tvl: {
      token0: totalToken0.toString(),
      token1: totalToken1.toString(),
    },
    formatted: {
      token0: curr0,
      token1: curr1,
    },
    lastUpdated,
  })
}

export default handler
