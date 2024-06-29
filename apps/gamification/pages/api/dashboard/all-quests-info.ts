import { ChainId } from '@pancakeswap/chains'
import type { NextApiRequest, NextApiResponse } from 'next'
import qs from 'qs'
import { z } from 'zod'

const zAddress = z.string().regex(/^0x[a-fA-F0-9]{40}$/)
const zChainId = z.array(z.string()).refine((ids) => ids.every((id) => Object.values(ChainId).includes(Number(id))), {
  message: 'Invalid chainId value',
})

// Allow chainId to be optional and accept an empty array or an array of valid strings
const zChainIdOptional = zChainId.or(z.array(z.string()).length(0)).optional()

const zQuery = z.object({
  address: zAddress,
  chainId: zChainIdOptional,
  completionStatus: z.string(),
  page: z.coerce.number().nullable(),
  pageSize: z.coerce.number().max(100).nullable(),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.GAMIFICATION_DASHBOARD_API || !req.query || req.method !== 'GET') {
    return res.status(400).json({ message: 'API URL Empty / Method wrong' })
  }

  const queryString = qs.stringify(req.query)
  const queryParsed = qs.parse(queryString)
  const parsed = zQuery.safeParse(queryParsed)

  if (parsed.success === false) {
    return res.status(400).json({ message: 'Invalid query', reason: parsed.error })
  }

  const response = await fetch(
    `${process.env.GAMIFICATION_DASHBOARD_API}/quests/org/${queryParsed.address}?${queryString}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-secure-token': process.env.DASHBOARD_TOKEN as string,
      },
    },
  )

  if (!response.ok) {
    return res.status(400).json({ message: 'An error occurred please try again' })
  }

  const data = await response.json()

  return res.status(200).json(data)
}
