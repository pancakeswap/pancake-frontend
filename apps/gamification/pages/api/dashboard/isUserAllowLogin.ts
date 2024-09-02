import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.GAMIFICATION_DASHBOARD_API || req.method !== 'POST') {
    return res.status(400).json({ message: 'API URL Empty / Method wrong' })
  }

  if (!req?.headers?.authorization) {
    return res.status(400).json({ message: 'Header Authorization Empty' })
  }

  const response = await fetch(`${process.env.GAMIFICATION_DASHBOARD_API}/users/check-dashboard-access`, {
    method: 'POST',
    headers: {
      Authorization: req?.headers?.authorization as string,
      'Content-Type': 'application/json',
    },
  })

  const data = await response.json()

  if (!response.ok) {
    return res.status(400).json(data)
  }

  return res.status(200).json(data)
}
