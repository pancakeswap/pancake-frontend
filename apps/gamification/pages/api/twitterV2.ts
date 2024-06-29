import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
    return
  }

  const { accessToken } = req.method === 'GET' ? req.query : req.body

  if (!accessToken) {
    res.status(400).json({ message: 'Missing required parameters: accessToken' })
    return
  }

  const method = 'GET'

  const requestUrl = `https://api.twitter.com/2/users/1305349277422477313/followers`

  try {
    const response = await fetch(requestUrl, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      res.status(response.status).json({ message: response.statusText })
      return
    }

    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}
