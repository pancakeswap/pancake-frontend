import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!GAMIFICATION_PUBLIC_API || !req.body || req.method !== 'POST') {
    return res.status(400).json({ message: 'API URL Empty / Method wrong' })
  }

  const response = await fetch(`${GAMIFICATION_PUBLIC_API}/userInfo/v1/addUserInfo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: req.body,
  })

  const result = await response.json()
  if (!response.ok) {
    console.log('This is FE show Error: ', { result, response, body: req.body })
    return res.status(400).json(response)
    // return res.status(400).json(result)
  }

  return res.status(200).json(response)
}
