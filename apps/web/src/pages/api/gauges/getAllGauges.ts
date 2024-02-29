import { ChainId } from '@pancakeswap/chains'
import { getAllGauges } from '@pancakeswap/gauges'
import { NextApiHandler } from 'next'
import qs from 'qs'
import { getViemClients } from 'utils/viem.server'
import { stringify } from 'viem'

const MAX_CACHE_SECONDS = 60 * 5

const handler: NextApiHandler = async (req, res) => {
  const queryString = qs.stringify(req.query)
  const queryParsed = qs.parse(queryString)

  const testnet = Boolean(queryParsed.testnet ?? false)
  const inCap = Boolean(queryParsed.inCap ?? true)
  const bothCap = Boolean(queryParsed.bothCap ?? false)
  const killed = Boolean(queryParsed.killed ?? false)
  const blockNumber = queryParsed.blockNumber ? BigInt(queryParsed.blockNumber as string) : undefined

  try {
    const gauges = await getAllGauges(
      getViemClients({
        chainId: testnet ? ChainId.BSC_TESTNET : ChainId.BSC,
      }),
      {
        testnet,
        inCap,
        bothCap,
        killed,
        blockNumber,
      },
    )

    if (blockNumber) {
      // cache for long time if blockNumber is provided
      res.setHeader('Cache-Control', `max-age=10800, s-maxage=31536000`)
    } else {
      res.setHeader('Cache-Control', `max-age=10, s-maxage=${MAX_CACHE_SECONDS}, stale-while-revalidate`)
    }
    return res.status(200).json({
      data: JSON.parse(stringify(gauges)),
      lastUpdated: Number(Date.now()),
    })
  } catch (err) {
    return res.status(500).json({
      error: JSON.parse(stringify(err)),
    })
  }
}

export default handler
