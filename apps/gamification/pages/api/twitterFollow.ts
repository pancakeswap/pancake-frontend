import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { TaskType } from 'views/DashboardQuestEdit/type'
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { getOAuthHeader } from 'utils/getOAuthHeader'
import { TWITTER_CONSUMER_KEY } from 'views/Profile/utils/verifyTwitterFollowersIds'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { account, questId, token, tokenSecret, userId, targetUserId, providerId } = req.query
      if (!token || !tokenSecret || !userId || !targetUserId) {
        res.status(400).json({ message: 'Missing required parameters: token, tokenSecret, userId, targetUserId' })
        return
      }

      const url = `https://api.twitter.com/2/users/${userId}/following`
      const method = 'POST'
      const consumerKey = TWITTER_CONSUMER_KEY[providerId][0] as string
      const consumerSecret = TWITTER_CONSUMER_KEY[providerId][1] as string

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
              accessToken: token,
            }),
          },
        )

        const responseMarkTaskResult = await response.json()
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
