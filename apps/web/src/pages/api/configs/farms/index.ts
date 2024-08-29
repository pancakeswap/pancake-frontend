import { ChainId } from '@pancakeswap/chains'
import { SerializedFarmConfig } from '@pancakeswap/farms'
import { getFarmConfig } from '@pancakeswap/farms/constants'
import { farmsV3ConfigChainMap } from '@pancakeswap/farms/constants/v3'
import { CHAINS } from 'config/chains'
import { NextApiHandler } from 'next'
import { stringify } from 'viem'

const handler: NextApiHandler = async (req, res) => {
  const includeTestnet = !!req.query.includeTestnet
  const chains = !includeTestnet ? CHAINS.filter((chain) => !('testnet' in chain && chain.testnet)) : CHAINS

  try {
    let farms: Array<
      SerializedFarmConfig & {
        chainId: ChainId
        version: 2 | 3
      }
    > = []

    for (const chain of chains) {
      // eslint-disable-next-line no-await-in-loop
      const v2FarmConfig = await getFarmConfig(chain.id)
      if (v2FarmConfig) {
        farms = farms.concat(v2FarmConfig.map((farm) => ({ ...farm, chainId: chain.id, version: 2 })))
      }

      const v3FarmConfig = farmsV3ConfigChainMap[chain.id as keyof typeof farmsV3ConfigChainMap]

      if (v3FarmConfig) {
        farms = farms.concat(v3FarmConfig.map((farm) => ({ ...farm, chainId: chain.id, version: 3 })))
      }
    }

    // cache for long time, it should revalidate on every deployment
    res.setHeader('Cache-Control', `max-age=10800, s-maxage=31536000`)

    return res.status(200).json({
      data: JSON.parse(stringify(farms)),
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    return res.status(500).json({ error: JSON.parse(stringify(error)) })
  }
}
export default handler
