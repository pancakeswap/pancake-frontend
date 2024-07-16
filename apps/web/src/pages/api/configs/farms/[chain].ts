import { ChainId } from '@pancakeswap/chains'
import { UNIVERSAL_FARMS } from '@pancakeswap/farms'
import { NextApiHandler } from 'next'
import { nativeEnum, enum as zEnum } from 'zod'

const zChain = nativeEnum(ChainId).or(zEnum(Object.values(ChainId) as [string, ...string[]]))

const handler: NextApiHandler = async (req, res) => {
  const isChainInt = !Number.isNaN(parseInt(req.query.chain as string, 10))
  const chainQuery = isChainInt ? Number(req.query.chain) : req.query.chain
  const parsedChain = zChain.safeParse(chainQuery)

  if (parsedChain.success !== true) {
    return res.status(400).json({ error: parsedChain.error })
  }

  const chainId = isChainInt ? Number(parsedChain.data) : Number(req.query.chain)

  if (!chainId) {
    return res.status(400).json({ error: 'Invalid chain' })
  }

  try {
    return res.status(200).json({
      data: JSON.parse(JSON.stringify(UNIVERSAL_FARMS.filter((farm) => farm.chainId === chainId))),
      lastUpdatedAt: new Date().toISOString(),
    })
  } catch (error) {
    return res.status(500).json({ error: JSON.parse(JSON.stringify(error)) })
  }
}

export default handler
