import { createFarmFetcherV3 } from '@pancakeswap/farms'
import { farmsV3Map } from '@pancakeswap/farms/constants/index.v3'
import type { TvlMap } from '@pancakeswap/farms/src/fetchFarmsV3'
import { ChainId } from '@pancakeswap/sdk'
import { NextApiHandler } from 'next'
import { multicallv2 } from 'utils/multicall'
import { z } from 'zod'

const farmFetcherV3 = createFarmFetcherV3(multicallv2)

const supportedChainIdSubgraph = [ChainId.BSC, ChainId.GOERLI, ChainId.ETHEREUM]

const zChainEnum = z.nativeEnum(ChainId)

const handler: NextApiHandler = async (req, res) => {
  const parsed = zChainEnum.safeParse(Number(req.query.chainId))

  if (parsed.success === false) {
    return res.status(400).json(parsed.error)
  }

  const chainId = parsed.data

  if (farmFetcherV3.isChainSupported(chainId) === false) {
    return res.status(400).json({ error: 'Chain not supported' })
  }
  const farms = farmsV3Map[chainId]

  const HOST = process.env.VERCEL_URL || 'http://localhost:3000'

  const tvls: TvlMap = {}
  if (supportedChainIdSubgraph) {
    const results = await Promise.all(
      farms.map((f) => fetch(`${HOST}/api/farm/v3/tvl/${chainId}/${f.lpAddress}`).then((r) => r.json())),
    )
    results.forEach((r, i) => {
      tvls[farms[i].lpAddress] = r.formatted
    })
  }

  const data = await farmFetcherV3.fetchFarms({
    tvlMap: tvls,
    chainId: parsed.data,
    farms,
  })

  res.setHeader('Cache-Control', 's-maxage=30, max-age=10')

  return res.status(200).json(data)
}

export default handler
