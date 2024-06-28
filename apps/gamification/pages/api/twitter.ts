import type { NextApiRequest, NextApiResponse } from 'next'
import { generateOAuthHeaders } from './twitterOAuth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
    return
  }

  const { token, tokenSecret } = req.method === 'GET' ? req.query : req.body

  if (!token || !tokenSecret) {
    res.status(400).json({ message: 'Missing required parameters: token and tokenSecret' })
    return
  }

  const url = 'https://api.twitter.com/1.1/followers/ids.json'
  const params = {
    screen_name: 'PancakeSwap',
  }

  const method = 'GET'
  const consumerKey = process.env.TWITTER_CONSUMER_KEY as string
  const consumerSecret = process.env.TWITTER_CONSUMER_SECRET as string

  const oauthHeader = generateOAuthHeaders(method, url, consumerKey, consumerSecret, token, tokenSecret, params)

  const queryString = new URLSearchParams(params).toString()
  const requestUrl = `${url}?${queryString}`

  try {
    const response = await fetch(requestUrl, {
      method,
      headers: {
        authorization: oauthHeader,
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
