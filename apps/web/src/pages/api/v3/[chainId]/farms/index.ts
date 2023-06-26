import { createFarmFetcherV3, fetchCommonTokenUSDValue } from '@pancakeswap/farms'
import { priceHelperTokens } from '@pancakeswap/farms/constants/common'
import { farmsV3ConfigChainMap } from '@pancakeswap/farms/constants/v3'
import { ChainId } from '@pancakeswap/sdk'
import { NextApiHandler } from 'next'
import { getViemClients } from 'utils/viem.server'
import { nativeEnum as zNativeEnum } from 'zod'

const farmFetcherV3 = createFarmFetcherV3(getViemClients)

const zChainEnum = zNativeEnum(ChainId)

const handler: NextApiHandler = async (req, res) => {
  const parsed = zChainEnum.safeParse(Number(req.query.chainId))

  if (parsed.success === false) {
    return res.status(400).json(parsed.error)
  }

  const chainId = parsed.data

  if (!farmFetcherV3.isChainSupported(chainId)) {
    return res.status(400).json({ error: 'Chain not supported' })
  }
  const farms = farmsV3ConfigChainMap[chainId]

  const commonPrice = await fetchCommonTokenUSDValue(priceHelperTokens[chainId])

  const data = await farmFetcherV3.fetchFarms({
    chainId,
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
