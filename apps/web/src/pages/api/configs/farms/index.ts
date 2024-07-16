import { UNIVERSAL_FARMS } from '@pancakeswap/farms'
import { NextApiHandler } from 'next'
import { stringify } from 'viem'

const handler: NextApiHandler = async (req, res) => {
  // @todo @ChefJerry add back testnet farms
  // const includeTestnet = !!req.query.includeTestnet

  // cache for long time, it should revalidate on every deployment
  res.setHeader('Cache-Control', `max-age=10800, s-maxage=31536000`)
  try {
    return res.status(200).json({
      data: JSON.parse(stringify(UNIVERSAL_FARMS)),
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    return res.status(500).json({ error: JSON.parse(stringify(error)) })
  }
}

export default handler
