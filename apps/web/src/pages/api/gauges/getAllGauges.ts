import { getAllGauges } from '@pancakeswap/gauges'
import { NextApiHandler } from 'next'
import { stringify } from 'viem'

const MAX_CACHE_SECONDS = 60 * 5

const handler: NextApiHandler = async (req, res) => {
  const useTestnet = req.query.testnet
  try {
    const gauges = await getAllGauges({
      testnet: Boolean(useTestnet),
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
