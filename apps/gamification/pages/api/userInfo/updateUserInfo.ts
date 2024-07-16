import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.GAMIFICATION_DASHBOARD_API || !req.body || req.method !== 'PUT') {
    return res.status(400).json({ message: 'API URL Empty / Method wrong' })
  }
  const response = await fetch(`${GAMIFICATION_PUBLIC_API}/userInfo/v1/updateUserInfo`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: req.body,
  })

  if (!response.ok) {
    return res.status(400).json({ message: 'An error occurred please try again' })
  }

  return res.status(200).json(response)
}
