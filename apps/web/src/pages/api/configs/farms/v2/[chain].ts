import { ChainId, chainNames, chainNameToChainId } from '@pancakeswap/chains'
import { formatUniversalFarmToSerializedFarm, UNIVERSAL_FARMS } from '@pancakeswap/farms'
import { NextApiHandler } from 'next'
import { stringify } from 'viem'
import { enum as enum_, nativeEnum } from 'zod'

const allChainNames = Object.values(chainNames) as [string, ...string[]]

const zChain = nativeEnum(ChainId).or(enum_(allChainNames))

const handler: NextApiHandler = async (req, res) => {
  const isChainInt = !Number.isNaN(parseInt(req.query.chain as string, 10))
  const chainQuery = isChainInt ? Number(req.query.chain) : req.query.chain
  const parsedChain = zChain.safeParse(chainQuery)

  if (!parsedChain.success) {
    return res.status(400).json({ error: parsedChain.error })
  }

  const chainId = isChainInt ? Number(parsedChain.data) : Number(chainNameToChainId[parsedChain.data])

  if (!chainId) {
    return res.status(400).json({ error: 'Invalid chain' })
  }

  try {
    const farmConfig = UNIVERSAL_FARMS.filter((farm) => farm.chainId === chainId)
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
