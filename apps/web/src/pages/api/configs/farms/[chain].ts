import { ChainId, chainNames, chainNameToChainId } from '@pancakeswap/chains'
import { SerializedFarmConfig } from '@pancakeswap/farms'
import { getFarmConfig } from '@pancakeswap/farms/constants'
import { farmsV3ConfigChainMap } from '@pancakeswap/farms/constants/v3'
import { NextApiHandler } from 'next'
import { stringify } from 'viem'
import { enum as enum_, nativeEnum as zNativeEnum } from 'zod'

const allChainNames = Object.values(chainNames)
const zChain = zNativeEnum(ChainId).or(enum_(allChainNames as [string, ...string[]]))

const handler: NextApiHandler = async (req, res) => {
  const isChainInt = !Number.isNaN(parseInt(req.query.chain as string, 10))
  const chainQuery = isChainInt ? Number(req.query.chain) : req.query.chain
  const parsedChain = zChain.safeParse(chainQuery)

  if (parsedChain.success !== true) {
    return res.status(400).json({ error: parsedChain.error })
  }

  const chainId = isChainInt ? Number(parsedChain.data) : Number(chainNameToChainId[parsedChain.data])

  if (!chainId) {
    return res.status(400).json({ error: 'Invalid chain' })
  }

  try {
    let farms: Array<
      SerializedFarmConfig & {
        chainId: ChainId
        version: 2 | 3
      }
    > = []

    const v2FarmConfig = (await getFarmConfig(chainId)) ?? []
    farms = farms.concat(v2FarmConfig.map((farm) => ({ ...farm, chainId, version: 2 })))
    const v3FarmConfig = farmsV3ConfigChainMap[chainId as keyof typeof farmsV3ConfigChainMap] ?? []
    farms = farms.concat(v3FarmConfig.map((farm) => ({ ...farm, chainId, version: 3 })))

    // cache for long time, it should revalidate on every deployment
    res.setHeader('Cache-Control', `max-age=10800, s-maxage=31536000`)

    return res.status(200).json({
      data: JSON.parse(stringify(farms)),
      lastUpdatedAt: new Date().toISOString(),
    })
  } catch (error) {
    return res.status(500).json({ error: JSON.parse(stringify(error)) })
  }
}
export default handler
