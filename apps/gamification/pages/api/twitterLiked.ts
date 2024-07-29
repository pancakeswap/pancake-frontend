import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { getOAuthHeader } from 'utils/getOAuthHeader'
import { TaskType } from 'views/DashboardQuestEdit/type'
import { TWITTER_CONSUMER_KEY, TwitterFollowersId } from 'views/Profile/utils/verifyTwitterFollowersIds'

export default async function handler(req, res) {
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

      const consumerKey = TWITTER_CONSUMER_KEY[providerId as TwitterFollowersId].consumerKey as string
      const consumerSecret = TWITTER_CONSUMER_KEY[providerId as TwitterFollowersId].consumerKeySecret as string

      const url = `https://api.twitter.com/2/users/${userId}/liked_tweets`
      const method = 'GET'
      let nextToken = null
      let tweetFound = false

      // eslint-disable-next-line no-constant-condition
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const response = await fetch(url + (nextToken ? `?pagination_token=${nextToken}` : ''), {
          method,
          headers: {
            ...getOAuthHeader(url, method, consumerKey, consumerSecret, token, tokenSecret),
            'Content-Type': 'application/json',
          },
        })

        // eslint-disable-next-line no-await-in-loop
        const result = await response.json()
        if (!response.ok) {
          res.status(500).json({ message: result.title })
          return
        }

        const likedTweets = result.data
        if (likedTweets.some((tweet) => tweet.id.toLowerCase() === twitterPostId.toLowerCase())) {
          tweetFound = true
          break
        }

        nextToken = result.meta.next_token
        if (!nextToken) {
          break
        }
      }

      if (tweetFound) {
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
      }
    } catch (error) {
      res.status(500).json({ message: (error as Error).message })
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}
