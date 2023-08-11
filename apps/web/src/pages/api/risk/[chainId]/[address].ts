import { NextApiHandler } from 'next'
import { enum as zEnum, string as zString, object as zObject } from 'zod'

const host = 'https://red.alert.pancakeswap.com'
const url = '/red-api'
const endpoint = host + url

const zChainId = zEnum(['56'])

const zAddress = zString().regex(/^0x[a-fA-F0-9]{40}$/)

const zParams = zObject({
  chainId: zChainId,
  address: zAddress,
})

const handler: NextApiHandler = async (req, res) => {
  const parsed = zParams.safeParse(req.query)

  if (parsed.success === false) {
    return res.status(400).json(parsed.error)
  }

  const { chainId, address: address_ } = parsed.data
  const address = address_.toLowerCase()
  const body = JSON.stringify({
    chain_id: chainId,
    address,
  })
  const method = 'POST'

  const headers: HeadersInit = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  const response = await fetch(endpoint, {
    headers,
    body,
    method,
  })

  const json = await response.json()

  if (json.data.risk_level >= 0 && json.data.has_result) {
    res.setHeader('Cache-Control', 's-maxage=86400, max-age=3600')
  }

  return res.status(response.status).json({
    ...json,
    data: {
      address,
      chainId,
      isError: response.status !== 200,
      hasResult: json.data.has_result,
      riskLevel: json.data.risk_level,
      requestId: json.data.request_id,
      riskLevelDescription: json.data.risk_level_description,
      pollingInterval: json.data?.polling_interval ?? 0,
    },
  })
}

export default handler
