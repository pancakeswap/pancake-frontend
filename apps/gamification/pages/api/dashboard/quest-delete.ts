import { DASHBOARD_ALLOW_LIST } from 'config/constants/dashboardAllowList'
import { zQuestId } from 'config/validations'
import type { NextApiRequest, NextApiResponse } from 'next'
import qs from 'qs'
import { getViemClients } from 'utils/viem.server'
import { parseSiweMessage, verifySiweMessage } from 'viem/siwe'
import { object as zObject } from 'zod'

const zQuery = zObject({
  id: zQuestId,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.GAMIFICATION_DASHBOARD_API || !req.query || req.method !== 'DELETE') {
    return res.status(400).json({ message: 'API URL Empty / Method wrong' })
  }

  const body = JSON.parse(req.body)
  const message = body.siweMessage
  const { signature } = body
  const { address } = parseSiweMessage(message)
  if (!address || !DASHBOARD_ALLOW_LIST.includes(address)) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  const client = getViemClients({ chainId: req.body.chainId })
  const validSignature = await verifySiweMessage(client, {
    message,
    signature,
  })
  if (!validSignature) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const queryString = qs.stringify(req.query)
  const queryParsed = qs.parse(queryString)
  const parsed = zQuery.safeParse(queryParsed)
  if (parsed.success === false) {
    return res.status(400).json({ message: 'Invalid query', reason: parsed.error })
  }

  const response = await fetch(`${process.env.GAMIFICATION_DASHBOARD_API}/quests/${queryParsed.id}/delete`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-secure-token': process.env.DASHBOARD_TOKEN as string,
    },
  })

  if (!response.ok) {
    return res.status(400).json({ message: 'An error occurred please try again' })
  }

  const data = await response.json()

  return res.status(200).json(data)
}
