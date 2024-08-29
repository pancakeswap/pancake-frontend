import { formatUniversalFarmToSerializedFarm, UNIVERSAL_FARMS, UNIVERSAL_FARMS_WITH_TESTNET } from '@pancakeswap/farms'
import { NextApiHandler } from 'next'
import { stringify } from 'viem'

const handler: NextApiHandler = async (req, res) => {
  const includeTestnet = !!req.query.includeTestnet

  try {
    const farmConfig = includeTestnet ? UNIVERSAL_FARMS : UNIVERSAL_FARMS_WITH_TESTNET
    const legacyFarmConfig = formatUniversalFarmToSerializedFarm(farmConfig)
    // cache for long time, it should revalidate on every deployment
    res.setHeader('Cache-Control', `max-age=10800, s-maxage=31536000`)

    return res.status(200).json({
      data: JSON.parse(stringify(legacyFarmConfig)),
      lastUpdatedAt: new Date().toISOString,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: JSON.parse(stringify(error)) })
  }
}

export default handler
