import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
    return
  }

  const method = 'GET'

  const bearerToken = process.env.TWITTER_BEARER_TOKEN as string

  const requestUrl = `https://api.twitter.com/2/users/1305349277422477313/followers`

  try {
    const response = await fetch(requestUrl, {
      method,
      headers: {
        Authorization: `Bearer ${bearerToken}`,
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
