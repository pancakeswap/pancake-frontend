/* eslint-disable no-param-reassign */
import { NextApiHandler } from 'next'
import { z } from 'zod'
import { request, gql } from 'graphql-request'

const zChainId = z.enum(['56', '1'])

const zAddress = z.string().regex(/^0x[a-fA-F0-9]{40}$/)

const zParams = z.object({
  chainId: zChainId,
  address: zAddress,
})

const zReponse = z.object({
  pool: z
    .object({
      token0Price: z.string().min(1),
      token1Price: z.string().min(1),
    })
    .required(),
  positions: z
    .object({
      depositedToken0: z.string().min(1),
      depositedToken1: z.string().min(1),
      withdrawnToken0: z.string().min(1),
      withdrawnToken1: z.string().min(1),
    })
    .required()
    .array(),
})

const SUBGRAPH_URLS = {
  1: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
}

const handler: NextApiHandler = async (req, res) => {
  const parsed = zParams.safeParse(req.query)

  if (parsed.success === false) {
    return res.status(400).json(parsed.error)
  }

  const { chainId, address: address_ } = parsed.data
  const address = address_.toLowerCase()

  const response = await request(
    SUBGRAPH_URLS[chainId],
    gql`
    query tvl {
        pool(id: "${address}") {
          token0Price
          token1Price
        }
        positions(where: { pool: "${address}" }, first: 1000, orderBy: liquidity orderDirection: desc) {
          depositedToken0
          depositedToken1
          withdrawnToken0
          withdrawnToken1
        }
    }
    `,
  )

  const parsedResponse = zReponse.safeParse(response)
  if (parsedResponse.success === false) {
    return res.status(400).json(parsedResponse.error)
  }

  const { pool, positions } = parsedResponse.data
  const sumTokens = {
    token0: 0,
    token1: 0,
  }

  for (const pos of positions) {
    sumTokens.token0 += parseFloat(pos.depositedToken0) - parseFloat(pos.withdrawnToken0)
    sumTokens.token1 += parseFloat(pos.depositedToken1) - parseFloat(pos.withdrawnToken1)
  }

  const finalResult = sumTokens.token0 * parseFloat(pool.token0Price) + sumTokens.token1 * parseFloat(pool.token1Price)

  res.setHeader('Cache-Control', 's-maxage=300, max-age=300')

  return res.status(200).json({ tvl: finalResult, sumTokens })
}

export default handler
