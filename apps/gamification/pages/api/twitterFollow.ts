import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import crypto from 'crypto'
import { TaskType } from 'views/DashboardQuestEdit/type'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const OAuth = require('oauth-1.0a')

const getOAuthHeader = (
  url: string,
  method: string,
  consumerKey: string,
  consumerSecret: string,
  token: string,
  tokenSecret: string,
): { Authorization: string } => {
  const oauth = new OAuth({
    consumer: { key: consumerKey, secret: consumerSecret },
    signature_method: 'HMAC-SHA1',
    hash_function(baseString: string, key: string) {
      return crypto.createHmac('sha1', key).update(baseString).digest('base64')
    },
  })

  const requestData = { url, method }
  return oauth.toHeader(oauth.authorize(requestData, { key: token, secret: tokenSecret }))
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { account, questId, token, tokenSecret, userId, targetUserId } = req.query
      if (!token || !tokenSecret || !userId || !targetUserId) {
        res.status(400).json({ message: 'Missing required parameters: token, tokenSecret, userId, targetUserId' })
        return
      }
      const url = `https://api.twitter.com/2/users/${userId}/following`
      const method = 'POST'
      const consumerKey = process.env.TWITTER_CONSUMER_KEY as string
      const consumerSecret = process.env.TWITTER_CONSUMER_SECRET as string

      const response = await fetch(url, {
        method,
        headers: {
          ...getOAuthHeader(url, method, consumerKey, consumerSecret, token, tokenSecret),
          'Content-Type': 'application/json',
        },
        // Exp PCS Twitter Id
        body: JSON.stringify({ target_user_id: targetUserId }),
      })

      const result = await response.json()
      if (!response.ok) {
        res.status(500).json({ message: result.title })
      }

      if (result.data.following) {
        const responseMarkTask = await fetch(
          `${GAMIFICATION_PUBLIC_API}/userInfo/v1/markTaskStatus/${account}/${questId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              taskName: TaskType.X_FOLLOW_ACCOUNT,
              isCompleted: true,
            }),
          },
        )

        if (responseMarkTask.ok) {
          res.status(200).json(result)
        }
      }
    } catch (error) {
      res.status(500).json({ message: (error as Error).message })
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}
