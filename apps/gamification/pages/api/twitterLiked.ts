// eslint-disable-next-line @typescript-eslint/no-var-requires
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
      const response = await fetch(url, {
        method,
        headers: {
          ...getOAuthHeader(url, method, consumerKey, consumerSecret, token, tokenSecret),
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()
      if (!response.ok) {
        res.status(500).json({ message: result.title })
      }

      const likedTweets = result.data
      const liked = likedTweets.find((tweet) => tweet.id.toLowerCase() === twitterPostId.toLowerCase())

      if (liked) {
        const queryString = new URLSearchParams({
          account,
          questId,
          taskId,
          taskName: TaskType.X_LIKE_POST,
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
