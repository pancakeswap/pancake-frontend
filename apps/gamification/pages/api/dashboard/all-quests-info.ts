import type { NextApiRequest, NextApiResponse } from 'next'
import qs from 'qs'
import { parseSiweMessage, verifySiweMessage } from 'viem/siwe'
import { z } from 'zod'

import { getViemClients } from 'utils/viem.server'
import { DASHBOARD_ALLOW_LIST } from 'config/constants/dashboardAllowList'

const zAddress = z.string().regex(/^0x[a-fA-F0-9]{40}$/)
const zChainIdOptional = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val) return true // Allow empty string
      const chainIds = val.split(',')
      // eslint-disable-next-line no-restricted-globals
      return chainIds.every((id) => !isNaN(Number(id))) // Ensure all elements are numbers
    },
    {
      message: 'Invalid chainId format',
    },
  )

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

  const queryString = qs.stringify(req.query, { arrayFormat: 'comma' })
  const queryParsed = qs.parse(queryString)
  const parsed = zQuery.safeParse(queryParsed)

  if (parsed.success === false) {
    return res.status(400).json({ message: 'Invalid query', reason: parsed.error })
  }

  const unauthorized = () => res.status(401).json({ message: 'Unauthorized' })
  const encodedMessage = req.headers['x-g-siwe-message']
  const signature = req.headers['x-g-siwe-signature']
  const chainId = req.headers['x-g-siwe-chain-id']
  if (
    !encodedMessage ||
    !signature ||
    typeof encodedMessage !== 'string' ||
    typeof signature !== 'string' ||
    !chainId
  ) {
    return unauthorized()
  }
  const message = decodeURIComponent(encodedMessage)
  const { address } = parseSiweMessage(message)
  if (!address || !DASHBOARD_ALLOW_LIST.includes(address)) {
    return unauthorized()
  }
  const client = getViemClients({ chainId: Number(chainId) })
  const validSignature = await verifySiweMessage(client, {
    message,
    signature: signature as `0x{string}`,
  })
  if (!validSignature) {
    return unauthorized()
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
