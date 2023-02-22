import { createFarmFetcherV3, FarmConfigV3 } from '@pancakeswap/farms'
import { farmsV3 as farm97 } from '@pancakeswap/farms/constants/97'
import { farmsV3 as farm1 } from '@pancakeswap/farms/constants/1'
import { farmsV3 as farm5 } from '@pancakeswap/farms/constants/5'
import { farmsV3 as farm56 } from '@pancakeswap/farms/constants/56'
import { multicallv2 } from 'utils/multicall'
import { ChainId } from '@pancakeswap/sdk'
import { ChainMap } from 'config/constants/types'
import { NextApiHandler } from 'next'
import { z } from 'zod'
import type { TvlMap } from '@pancakeswap/farms/src/fetchFarmsV3'

const farmsMap = {
  [ChainId.ETHEREUM]: farm1,
  [ChainId.GOERLI]: farm5,
  [ChainId.BSC]: farm56,
  [ChainId.BSC_TESTNET]: farm97,
} satisfies ChainMap<FarmConfigV3[]>

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
  const farms = farmsMap[chainId]

  const HOST = process.env.VERCEL_URL || 'http://localhost:3000'

  const tvls: TvlMap = {}
  if (supportedChainIdSubgraph) {
    const results = await Promise.all(
      farms.map((f) => fetch(`${HOST}/api/farm-tvl/${chainId}/${f.lpAddress}`).then((r) => r.json())),
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
