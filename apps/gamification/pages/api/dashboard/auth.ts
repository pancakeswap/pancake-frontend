import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.GAMIFICATION_DASHBOARD_API || req.method !== 'POST') {
    return res.status(400).json({ message: 'API URL Empty / Method wrong' })
  }

  const response = await fetch(`${process.env.GAMIFICATION_DASHBOARD_API}/users/authenticate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: req.body,
  })

  const data = await response.json()

  if (!response.ok) {
    return res.status(400).json(data)
  }

  return res.status(200).json(data)
}
