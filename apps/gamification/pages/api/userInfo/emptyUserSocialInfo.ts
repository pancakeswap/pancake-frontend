import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!GAMIFICATION_PUBLIC_API || !req.body || req.method !== 'POST') {
    return res.status(400).json({ message: 'API URL Empty / Method wrong' })
  }

  if (!req?.headers?.authorization) {
    return res.status(400).json({ message: 'Header Authorization Empty' })
  }

  const response = await fetch(`${GAMIFICATION_PUBLIC_API}/userInfo/v1/emptyUserSocialInfo`, {
    method: 'POST',
    headers: {
      Authorization: req?.headers?.authorization as string,
      'Content-Type': 'application/json',
    },
    body: req.body,
  })

  if (!response.ok) {
    return res.status(400).json({ message: 'An error occurred please try again' })
  }

  return res.status(200).json(response)
}
