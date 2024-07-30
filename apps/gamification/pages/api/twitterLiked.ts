import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { withSiweAuth } from 'middlewares/withSiwe'
import { getOAuthHeader } from 'utils/getOAuthHeader'
import { TaskType } from 'views/DashboardQuestEdit/type'
import { TWITTER_CONSUMER_KEY, TwitterFollowersId } from 'views/Profile/utils/verifyTwitterFollowersIds'

const handler = withSiweAuth(async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { account, questId, taskId, token, tokenSecret, userId, providerId, twitterPostId } = req.query

      if (!account || !questId || !token || !tokenSecret || !taskId || !userId || !providerId || !twitterPostId) {
        res.status(400).json({
          message:
            'Missing required parameters: account, questId, taskId, token, tokenSecret, userId, providerId, twitterPostId',
        })
        return
      }
      const isValidTwitterId = /^[0-9]{1,19}$/.test(twitterPostId as string)
      if (!isValidTwitterId) {
        res.status(400).json({
          message: 'Invalid twitter id',
        })
        return
      }

      const consumerKey = TWITTER_CONSUMER_KEY[providerId as TwitterFollowersId].consumerKey as string
      const consumerSecret = TWITTER_CONSUMER_KEY[providerId as TwitterFollowersId].consumerKeySecret as string

      const url = `https://api.twitter.com/2/users/${userId}/likes`
      const method = 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          ...getOAuthHeader(url, method, consumerKey, consumerSecret, token as string, tokenSecret as string),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tweet_id: (twitterPostId as string).toLowerCase(),
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        res.status(500).json({ message: result.title })
        return
      }

      const apiRes = await fetch(
        `${GAMIFICATION_PUBLIC_API}/userInfo/v1/user/${account}/quest/${questId}/mark-task-status`,
        {
          method: 'POST',
          headers: {
            Authorization: process.env.TASK_STATUS_TOKEN as string,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            taskName: TaskType.X_LIKE_POST,
            taskId,
            isCompleted: true,
          }),
        },
      )

      const responseMarkTaskResult = await apiRes.json()
      if (apiRes.ok) {
        res.status(200).json(responseMarkTaskResult)
      } else {
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
