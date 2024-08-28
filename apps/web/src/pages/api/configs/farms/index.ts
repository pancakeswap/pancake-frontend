import { UNIVERSAL_FARMS, UNIVERSAL_FARMS_WITH_TESTNET } from '@pancakeswap/farms'
import { NextApiHandler } from 'next'
import { stringify } from 'viem'

const handler: NextApiHandler = async (req, res) => {
  const includeTestnet = !!req.query.includeTestnet

  // cache for long time, it should revalidate on every deployment
  res.setHeader('Cache-Control', `max-age=10800, s-maxage=31536000`)
  try {
    return res.status(200).json({
      data: JSON.parse(stringify(includeTestnet ? UNIVERSAL_FARMS_WITH_TESTNET : UNIVERSAL_FARMS)),
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    return res.status(500).json({ error: JSON.parse(stringify(error)) })
  }
}

export default handler
