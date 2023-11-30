import { getAllGauges } from '@pancakeswap/gauges'
import { NextApiHandler } from 'next'
import qs from 'qs'
import { stringify } from 'viem'

const MAX_CACHE_SECONDS = 60 * 5

const handler: NextApiHandler = async (req, res) => {
  const queryString = qs.stringify(req.query)
  const queryParsed = qs.parse(queryString)

  try {
    const gauges = await getAllGauges({
      testnet: Boolean(queryParsed.testnet),
      inCap: Boolean(queryParsed.inCap),
    })

    res.setHeader('Cache-Control', `max-age=0, s-maxage=${MAX_CACHE_SECONDS}, stale-while-revalidate`)
    return res.status(200).json({
      data: JSON.parse(stringify(gauges)),
      lastUpdated: Number(Date.now()),
    })
  } catch (err) {
    return res.status(500).json({
      error: err,
    })
  }
}

export default handler
