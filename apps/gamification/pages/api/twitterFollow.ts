import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { zAddress, zQuestId } from 'config/validations'
import qs from 'qs'
import { getOAuthHeader } from 'utils/getOAuthHeader'
import { TaskType } from 'views/DashboardQuestEdit/type'
import { TWITTER_CONSUMER_KEY, TwitterFollowersId } from 'views/Profile/utils/verifyTwitterFollowersIds'
import { object as zObject, string as zString } from 'zod'

const zQuery = zObject({
  account: zAddress,
  questId: zQuestId,
  token: zString(),
  tokenSecret: zString(),
  targetUserId: zString(),
  providerId: zString(),
  taskId: zQuestId,
})

// eslint-disable-next-line consistent-return
const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const queryString = qs.stringify(req.query)
      const queryParsed = qs.parse(queryString)
      const parsed = zQuery.safeParse(queryParsed)
      if (parsed.success === false) {
        return res.status(400).json({ message: 'Invalid query', reason: parsed.error })
      }

      if (!req?.headers?.authorization) {
        return res.status(400).json({ message: 'Header Authorization Empty' })
      }

      const { account, questId, token, tokenSecret, userId, targetUserId, providerId, taskId } = req.query
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
        return res.status(500).json({ message: result.title })
      }

      if (result.data.following) {
        const apiRes = await fetch(
          `${GAMIFICATION_PUBLIC_API}/userInfo/v1/user/${account}/quest/${questId}/mark-task-status`,
          {
            method: 'POST',
            headers: {
              Authorization: req?.headers?.authorization as string,
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
          return res.status(200).json(responseMarkTaskResult)
        }

        return res.status(500).json({ message: responseMarkTaskResult.title })
      }
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message })
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }
}

export default handler
