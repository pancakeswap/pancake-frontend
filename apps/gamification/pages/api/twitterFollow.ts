import { TaskType } from 'views/DashboardQuestEdit/type'
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { getOAuthHeader } from 'utils/getOAuthHeader'
import { TWITTER_CONSUMER_KEY, TwitterFollowersId } from 'views/Profile/utils/verifyTwitterFollowersIds'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { account, questId, token, tokenSecret, userId, targetUserId, providerId, taskId } = req.query
      if (!token || !tokenSecret || !userId || !targetUserId) {
        res.status(400).json({ message: 'Missing required parameters: token, tokenSecret, userId, targetUserId' })
        return
      }

      const url = `https://api.twitter.com/2/users/${userId}/following`
      const method = 'POST'
      const consumerKey = TWITTER_CONSUMER_KEY[providerId as TwitterFollowersId].consumerKey as string
      const consumerSecret = TWITTER_CONSUMER_KEY[providerId as TwitterFollowersId].consumerKeySecret as string

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
        const queryString = new URLSearchParams({
          account,
          questId,
          taskId,
          taskName: TaskType.X_FOLLOW_ACCOUNT,
        }).toString()

        const responseMarkTask = await fetch(`/api/userInfo/markTaskStatus?${queryString}`, { method: 'POST' })

        const responseMarkTaskResult = await responseMarkTask.json()
        if (responseMarkTask.ok) {
          res.status(200).json(responseMarkTaskResult)
        }

        res.status(500).json({ message: responseMarkTaskResult.title })
      }
    } catch (error) {
      res.status(500).json({ message: (error as Error).message })
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}
