import { DASHBOARD_ALLOW_LIST } from 'config/constants/dashboardAllowList'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getViemClients } from 'utils/viem.server'
import { parseSiweMessage, verifySiweMessage } from 'viem/siwe'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.GAMIFICATION_DASHBOARD_API || req.method !== 'POST') {
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

  const response = await fetch(`${process.env.GAMIFICATION_DASHBOARD_API}/quests/create`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-secure-token': process.env.DASHBOARD_TOKEN as string,
    },
    body: req.body,
  })

  const data = await response.json()

  if (!response.ok) {
    return res.status(400).json(data)
  }

  return res.status(200).json(data)
}
