/* eslint-disable no-param-reassign */
import { gql, request } from 'graphql-request'
import { NextApiHandler } from 'next'
import { z } from 'zod'

const zChainId = z.enum(['56', '1', '5', '97'])

const zAddress = z.string().regex(/^0x[a-fA-F0-9]{40}$/)

const zParams = z.object({
  chainId: zChainId,
  address: zAddress,
})

const SUBGRAPH_URLS = {
  1: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  5: 'https://api.thegraph.com/subgraphs/name/liqwiz/uniswap-v3-goerli',
}

const cacheTime = {
  1: 10,
  5: 10,
  56: 2,
  97: 2,
}

// currently can get the total active liquidity for a pool
// TODO: v3 farms update subgraph urls
const handler: NextApiHandler = async (req, res) => {
  const parsed = zParams.safeParse(req.query)

  if (parsed.success === false) {
    return res.status(400).json(parsed.error)
  }

  const { chainId, address: address_ } = parsed.data

  const address = address_.toLowerCase()

  const result = []
  let page = 0

  const maxPage = 3

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const response = await request(
      SUBGRAPH_URLS[chainId],
      gql`
        query AllV3Ticks($poolAddress: String!, $skip: Int!) {
          ticks(first: 1000, skip: $skip, where: { poolAddress: $poolAddress }, orderBy: tickIdx) {
            tick: tickIdx
            liquidityNet
            price0
            price1
          }
        }
      `,
      {
        poolAddress: address,
        skip: page * 1000,
      },
    )
    result.push(response.ticks)
    if (response.ticks.length !== 1000 || page > maxPage) {
      break
    }
    page += 1
  }

  const lastUpdated = new Date().toISOString()

  res.setHeader(
    'Cache-Control',
    `s-maxage=${cacheTime[chainId]}, stale-while-revalidate=${cacheTime[chainId] + cacheTime[chainId] / 2}`,
  )

  return res.status(200).json({
    data: result,
    lastUpdated,
  })
}

export default handler
