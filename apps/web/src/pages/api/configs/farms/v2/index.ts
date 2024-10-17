import { fetchAllUniversalFarms, formatUniversalFarmToSerializedFarm } from '@pancakeswap/farms'
import { NextApiHandler } from 'next'
import { stringify } from 'viem'

const handler: NextApiHandler = async (req, res) => {
  try {
    const farmConfig = await fetchAllUniversalFarms()
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
