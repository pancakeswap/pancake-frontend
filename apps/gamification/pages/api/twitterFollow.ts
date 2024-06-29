import { generateOAuthHeaders } from './twitterOAuth'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { token, tokenSecret, userId } = req.method === 'GET' ? req.query : req.body

      if (!token || !tokenSecret) {
        res.status(400).json({ message: 'Missing required parameters: token and tokenSecret' })
        return
      }

      const url = `https://api.twitter.com/2/users/${userId}/following`
      const method = 'POST'

      const consumerKey = process.env.TWITTER_CONSUMER_KEY as string
      const consumerSecret = process.env.TWITTER_CONSUMER_SECRET as string

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: generateOAuthHeaders(method, url, consumerKey, consumerSecret, token, tokenSecret),
          'Content-Type': 'application/json',
        },
        // PCS Twitter Id
        body: JSON.stringify({ target_user_id: '1305349277422477313' }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Something went wrong')
      }

      res.status(200).json(response.json())
    } catch (error) {
      res.status(500).json({ message: (error as Error).message })
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}
