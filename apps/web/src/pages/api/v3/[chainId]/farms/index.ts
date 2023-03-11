import { createFarmFetcherV3, fetchCommonTokenUSDValue } from '@pancakeswap/farms'
import { farmsV3Map } from '@pancakeswap/farms/constants/v3'
import { priceHelperTokens } from '@pancakeswap/farms/constants/common'
import type { TvlMap } from '@pancakeswap/farms/src/fetchFarmsV3'
import { ChainId } from '@pancakeswap/sdk'
import { NextApiHandler } from 'next'
import { multicallv2 } from 'utils/multicall'
import { z } from 'zod'

const farmFetcherV3 = createFarmFetcherV3(multicallv2)

const supportedChainIdSubgraph = [ChainId.BSC, ChainId.GOERLI, ChainId.ETHEREUM, ChainId.BSC_TESTNET]

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
  if (supportedChainIdSubgraph.includes(chainId)) {
    const results = await Promise.allSettled(
      farms.map((f) => fetch(`${HOST}/api/v3/${chainId}/farms/tvl/${f.lpAddress}`).then((r) => r.json())),
    )
    results.forEach((r, i) => {
      tvls[farms[i].lpAddress] =
        r.status === 'fulfilled' ? { ...r.value.formatted, updatedAt: r.value.updatedAt } : null
    })
  }

  const commonPrice = await fetchCommonTokenUSDValue(priceHelperTokens[chainId])

  const data = await farmFetcherV3.fetchFarms({
    tvlMap: tvls,
    chainId: parsed.data,
    farms,
    commonPrice,
  })

  const farmsWithPrice = data.farmsWithPrice.map((f) => ({
    ...f,
    token: f.token.serialize,
    quoteToken: f.quoteToken.serialize,
  }))

  res.setHeader('Cache-Control', 's-maxage=60, max-age=30, stale-while-revalidate=300')

  return res.status(200).json({
    ...data,
    farmsWithPrice,
  })
}

export default handler
