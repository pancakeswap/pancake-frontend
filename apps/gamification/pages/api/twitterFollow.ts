import { TaskType } from 'views/DashboardQuestEdit/type'
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { getOAuthHeader } from 'utils/getOAuthHeader'
import { TWITTER_CONSUMER_KEY, TwitterFollowersId } from 'views/Profile/utils/verifyTwitterFollowersIds'
import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { withSiweAuth } from 'middlewares/withSiwe'

const handler = withSiweAuth(async (req, res) => {
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
          ...getOAuthHeader(url, method, consumerKey, consumerSecret, token as string, tokenSecret as string),
          'Content-Type': 'application/json',
        },
        // Exp PCS Twitter Id
        body: JSON.stringify({ target_user_id: targetUserId }),
      })

      const result = await response.json()
      if (!response.ok) {
        res.status(500).json({ message: result.title })
        return
      }

      if (result.data.following) {
        const apiRes = await fetch(
          `${GAMIFICATION_PUBLIC_API}/userInfo/v1/user/${account}/quest/${questId}/mark-task-status`,
          {
            method: 'POST',
            headers: {
              Authorization: process.env.TASK_STATUS_TOKEN as string,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              taskName: TaskType.X_FOLLOW_ACCOUNT,
              taskId,
              isCompleted: true,
            }),
          },
        )

        const responseMarkTaskResult = await apiRes.json()
        if (apiRes.ok) {
          res.status(200).json(responseMarkTaskResult)
          return
        }

        res.status(500).json({ message: responseMarkTaskResult.title })
      }
    } catch (error) {
      res.status(500).json({ message: (error as Error).message })
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
})

export default handler
